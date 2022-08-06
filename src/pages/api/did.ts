// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createNewDID } from 'lib/did'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = await createNewDID()
    return res.status(200).json({ success: true, data: { address: data.address, did: data.did } })
  }
}
