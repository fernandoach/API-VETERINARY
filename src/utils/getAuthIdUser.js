import { verifyJWT } from './verifyJWT.js'

function getAuthIdUser (req) {
  try {
    const token = req.cookies?.accessToken
    if (!token) {
      throw new Error('Sin autorización.')
    }

    const verify = verifyJWT(token)
    if (!verify || !verify.data) {
      throw new Error('Token inválido.')
    }

    return verify.data
  } catch (error) {
    throw new Error('Sin autorización.')
  }
}

export { getAuthIdUser }
