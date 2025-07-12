import { getUserRoleForId } from '../repositories/userRepository/getUserRoleForId.js'
import { verifyJWT } from '../utils/verifyJWT.js'

async function authUserMiddleware (req, res, next) {
  try {
    const authToken = req.cookies.accessToken
    if (!authToken) return res.status(401).json({ message: 'Sin autorización.' })

    const verify = verifyJWT(authToken)
    if (!verify.data) {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    const idUser = verify.data
    const role = await getUserRoleForId(idUser)
    if (!(['U', 'A', 'V'].includes(role))) {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message })
    }

    return res.status(401).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Sin autorización.' })
  }
}

async function authVeterinaryMiddleware (req, res, next) {
  try {
    const authToken = req.cookies.accessToken
    if (!authToken) return res.status(401).json({ message: 'Sin autorización.' })

    const verify = verifyJWT(authToken)
    if (!verify.data) {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    const idUser = verify.data
    const role = await getUserRoleForId(idUser)

    if (!(role === 'V')) {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message })
    }

    return res.status(401).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Sin autorización.' })
  }
}

async function authAdminMiddleware (req, res, next) {
  try {
    const authToken = req.cookies.accessToken
    if (!authToken) return res.status(401).json({ message: 'Sin autorización.' })

    const verify = verifyJWT(authToken)
    if (!verify.data) {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    const idUser = verify.data
    const role = await getUserRoleForId(idUser)

    if (role !== 'A') {
      return res.status(401).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message })
    }

    return res.status(401).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Sin autorización.' })
  }
}

export { authUserMiddleware, authAdminMiddleware, authVeterinaryMiddleware }
