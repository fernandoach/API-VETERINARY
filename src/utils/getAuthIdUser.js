import { verifyJWT } from './verifyJWT.js'

async function getAuthIdUser (authHeader = '') {
  try {
    const authToken = authHeader.split(' ')[1]
    if (!authToken) {
      throw new Error('Sin autorización.')
    }

    const verify = await verifyJWT(authToken)
    if (!verify || !verify.data) {
      throw new Error('Token inválido.')
    }

    return verify.data
  } catch (error) {
    throw new Error('Sin autorización.')
  }
}

export { getAuthIdUser }
