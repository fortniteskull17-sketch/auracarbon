import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { category, country } = req.query

    // Build filter
    const where: any = {}
    if (category) where.category = category as string

    const materials = await prisma.rawMaterial.findMany({
      where,
      include: {
        material_factors: {
          where: country
            ? {
                grid: {
                  country_code: country as string,
                },
              }
            : undefined,
          include: {
            grid: true,
          },
        },
      },
      take: 100,
    })

    return res.json(materials)
  } catch (error) {
    console.error('Materials API error:', error)
    return res.status(500).json({ error: 'Failed to fetch materials' })
  }
}
