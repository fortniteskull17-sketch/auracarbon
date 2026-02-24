import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const grids = await prisma.gridFactor.findMany({
      orderBy: { country: 'asc' },
    })

    return res.json(grids)
  } catch (error) {
    console.error('Grid factors API error:', error)
    return res.status(500).json({ error: 'Failed to fetch countries' })
  }
}
