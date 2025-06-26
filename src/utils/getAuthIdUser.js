import { verifyJWT } from './verifyJWT.js'

async function getAuthIdUser (req) {
  try {
    const authContent = req.header('Authorization') || ''

    const authToken = authContent.split(' ')[1]
    if (!authToken) {
      throw new Error('Token no valido.')
    }

    const verify = verifyJWT(authToken)
    if (!verify) {
      throw new Error('Token no valido.')
    }

    const idUser = verify.data
    return idUser
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Token no valido.')
    }
    throw new Error(error)
  }
}

export { getAuthIdUser }
