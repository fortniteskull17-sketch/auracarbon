import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '../../../lib/auth.config'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const session = await getServerSession(req, res, authConfig)
  if (!session?.user || !(session.user as any).id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { limit = '50', offset = '0' } = req.query

    const calculations = await prisma.calculation.findMany({
      where: {
        user_id: (session.user as any).id as string,
      },
      include: {
        items: {
          include: {
            material: true,
          },
        },
        grid: true,
      },
      orderBy: { created_at: 'desc' },
      skip: parseInt(offset as string),
      take: parseInt(limit as string),
    })

    const total = await prisma.calculation.count({
      where: { user_id: (session.user as any).id as string },
    })

    return res.json({
      calculations,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    })
  } catch (error) {
    console.error('Records API error:', error)
    return res.status(500).json({ error: 'Failed to fetch calculations' })
  }
}
