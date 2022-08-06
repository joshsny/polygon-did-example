import { createDID } from '@ayanworks/polygon-did-registrar'

export const createNewDID = async () => {
  const result = await createDID('testnet')

  if (result.success) return result.data

  throw Error('Failed to create DID')
}
