import type { NextApiRequest, NextApiResponse } from 'next'

function calculateGreenCredits(baseline: number, newEmissions: number, price = 5) {
  const delta = baseline - newEmissions
  const revenue = delta > 0 ? delta * price : 0
  const reductionPercent = baseline > 0 ? Math.round((delta / baseline) * 1000) / 10 : 0
  return {
    baseline_tco2e: baseline,
    new_tco2e: newEmissions,
    delta_tco2e: delta,
    reduction_percent: reductionPercent,
    credit_price_usd: price,
    potential_revenue_usd: Math.round(revenue * 100) / 100,
    eligible_for_credits: delta > 0
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' })
  const { baseline_tco2e, new_tco2e, credit_price_usd } = req.body
  if (typeof baseline_tco2e !== 'number' || typeof new_tco2e !== 'number') {
    return res.status(400).json({ detail: 'Invalid input' })
  }
  const result = calculateGreenCredits(baseline_tco2e, new_tco2e, credit_price_usd ?? 5)
  return res.status(200).json({ ok: true, result })
}
