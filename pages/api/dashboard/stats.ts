import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const session = await getServerSession(req, res, authConfig)
  if (!session?.user || !session.user.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const userId = session.user.id as string
    const now = new Date()
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Fetch all calculations
    const allCalcs = await prisma.calculation.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        total_e_kg: true,
        total_e_ton: true,
        total_credits_eu: true,
        total_credits_vcc: true,
        cbam_risk: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })

    // YTD Totals
    const ytdCalcs = allCalcs.filter((c) => c.created_at >= yearAgo)
    const ytdEmissions = ytdCalcs.reduce((sum, c) => sum + (c.total_e_ton ?? 0), 0)
    const ytdCredits = ytdCalcs.reduce((sum, c) => sum + (c.total_credits_eu ?? 0) + (c.total_credits_vcc ?? 0), 0)

    // Monthly breakdown (last 12 months)
    const monthlyData: Record<string, number> = {}
    const monthlyCredits: Record<string, number> = {}
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = month.toISOString().slice(0, 7) // YYYY-MM

      const monthCalcs = allCalcs.filter((c) => c.created_at.toISOString().slice(0, 7) === monthKey)
      monthlyData[monthKey] = monthCalcs.reduce((sum, c) => sum + (c.total_e_ton ?? 0), 0)
      monthlyCredits[monthKey] = monthCalcs.reduce(
        (sum, c) => sum + (c.total_credits_eu ?? 0) + (c.total_credits_vcc ?? 0),
        0
      )
    }

    // CBAM Risk Distribution
    const riskCounts = {
      Low: allCalcs.filter((c) => c.cbam_risk === 'Low').length,
      Medium: allCalcs.filter((c) => c.cbam_risk === 'Medium').length,
      High: allCalcs.filter((c) => c.cbam_risk === 'High').length,
    }

    // Monthly trend (last calculation > previous calculation?)
    let trend = 'stable'
    const lastMonth = ytdCalcs.filter(
      (c) => c.created_at >= new Date(now.getFullYear(), now.getMonth() - 1, 1)
    )
    const prevMonth = ytdCalcs.filter(
      (c) =>
        c.created_at >= new Date(now.getFullYear(), now.getMonth() - 2, 1) &&
        c.created_at < new Date(now.getFullYear(), now.getMonth() - 1, 1)
    )
    if (lastMonth.length > 0 && prevMonth.length > 0) {
      const lastMonthTotal = lastMonth.reduce((sum, c) => sum + (c.total_e_ton ?? 0), 0)
      const prevMonthTotal = prevMonth.reduce((sum, c) => sum + (c.total_e_ton ?? 0), 0)
      if (lastMonthTotal > prevMonthTotal * 1.1) trend = 'increasing'
      if (lastMonthTotal < prevMonthTotal * 0.9) trend = 'decreasing'
    }

    return res.json({
      summary: {
        total_calculations: allCalcs.length,
        ytd_emissions_ton: Math.round(ytdEmissions * 100) / 100,
        ytd_credits_usd: Math.round(ytdCredits * 100) / 100,
        monthly_trend: trend,
        carbon_velocity_kg_per_min: Math.round((ytdEmissions * 1000) / (ytdCalcs.length * 30 * 24 * 60) * 100) / 100,
      },
      risk_distribution: riskCounts,
      monthly_data: monthlyData,
      monthly_credits: monthlyCredits,
      latest_calculation: allCalcs[0] || null,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}
