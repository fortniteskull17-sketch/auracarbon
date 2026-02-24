import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '../../../lib/auth.config'
import { prisma } from '../../../lib/prisma'
import CarbonEngine from '../../../lib/carbon-engine'
import { z } from 'zod'

const calculateSchema = z.object({
  items: z.array(
    z.object({
      material_id: z.string(),
      activity: z.number().positive(),
      unit: z.enum(['ton', 'kg', 'm3', 'liter', 'kwh']),
      scope: z.optional(z.enum(['1', '2', '3', '1,2,3'])).default('1,2,3'),
      gwp_factor: z.optional(z.number().positive()).default(1.0),
    })
  ),
  grid_id: z.string(),
  calculation_name: z.optional(z.string()),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const session = await getServerSession(req, res, authConfig)
  if (!session?.user || !(session.user as any).id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const parsed = calculateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error })
    }

    const { items, grid_id, calculation_name } = parsed.data

    // Fetch grid
    const grid = await prisma.gridFactor.findUnique({
      where: { id: grid_id },
    })
    if (!grid) return res.status(404).json({ error: 'Grid not found' })

    // Calculate each item
    const calculatedItems = await Promise.all(
      items.map(async (item) => {
        const material = await prisma.rawMaterial.findUnique({
          where: { id: item.material_id },
        })
        if (!material) throw new Error(`Material ${item.material_id} not found`)

        // Fetch the specific EF for this material in this country
        const factor = await prisma.materialFactor.findFirst({
          where: {
            material_id: item.material_id,
            grid_id,
          },
        })

        const ef = factor?.ef_kg_co2_unit || material.default_ef_kg_co2
        const gwp = factor?.gwp_factor || item.gwp_factor

        // Run calculation
        const result = CarbonEngine.calculate({
          activity: item.activity,
          unit: item.unit,
          emissionFactor: ef,
          gwpFactor: gwp,
          scope: item.scope,
        })

        return {
          material_id: item.material_id,
          activity: item.activity,
          unit: item.unit,
          scope: item.scope,
          gwp_factor: gwp,
          e_kg: result.e_kg,
          e_ton: result.e_ton,
          materialName: material.name,
          cbamRisk: result.cbamRisk,
        }
      })
    )

    // Sum totals
    const total_e_kg = calculatedItems.reduce((sum, item) => sum + item.e_kg, 0)
    const total_e_ton = total_e_kg / 1000
    const cbamRisk = calculatedItems.some((item) => item.cbamRisk === 'High')
      ? 'High'
      : calculatedItems.some((item) => item.cbamRisk === 'Medium')
        ? 'Medium'
        : 'Low'

    // Calculate credits
    const total_credits_eu = Math.round((total_e_ton * 90) * 100) / 100 // @ $90/ton
    const total_credits_vcc = Math.round((total_e_ton * 5) * 100) / 100 // @ $5/ton

    // Save calculation to database
    const calculation = await prisma.calculation.create({
      data: {
        user_id: (session.user as any).id as string,
        tenant_id: (session.user as any).tenant_id,
        grid_id,
        calculation_name: calculation_name || `Calculation ${new Date().toLocaleDateString()}`,
        total_e_kg,
        total_e_ton,
        total_credits_eu,
        total_credits_vcc,
        cbam_risk: cbamRisk,
        items: {
          create: calculatedItems.map((item) => ({
            material_id: item.material_id,
            activity: item.activity,
            unit: item.unit,
            scope: item.scope,
            gwp_factor: item.gwp_factor,
            e_kg: item.e_kg,
            e_ton: item.e_ton,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Log to audit trail
    await prisma.auditLog.create({
      data: {
        user_id: (session.user as any).id as string,
        action: 'create_calculation',
        resource_type: 'Calculation',
        resource_id: calculation.id,
        new_value: JSON.stringify({
          items: calculatedItems.length,
          total_e_ton,
          cbamRisk,
        }),
      },
    }).catch(() => {})

    return res.json({
      id: calculation.id,
      total_e_kg,
      total_e_ton,
      total_credits_eu,
      total_credits_vcc,
      cbam_risk: cbamRisk,
      items: calculatedItems,
      recommendations: CarbonEngine.getOptimizationRecommendations({
        e_kg: total_e_kg,
        e_ton: total_e_ton,
        cbamRisk: cbamRisk as any,
        cbamIntensity: total_e_kg / (calculatedItems.reduce((sum, i) => sum + i.activity, 0) * 1000),
      }),
    })
  } catch (error) {
    console.error('Calculation API error:', error)
    return res.status(500).json({
      error: 'Calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
