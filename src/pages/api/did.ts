// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { registerDID } from '@ayanworks/polygon-did-registrar'
import { createNewDID } from 'lib/did'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = await createNewDID()

    const txHash = await registerDID(data.did, data.privateKey)

    console.log('tx hash', txHash)
    return res
      .status(200)
      .json({ success: true, data: { address: data.address, did: data.did, privateKey: data.privateKey } })
  }
}
