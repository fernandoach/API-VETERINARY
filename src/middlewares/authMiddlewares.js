import { getUserRoleForId } from '../repositories/userRepository/getUserRoleForId.js'
import { verifyJWT } from '../utils/verifyJWT.js'

async function authUserMiddleware (req, res, next) {
  try {
    const authContent = req.header('Authorization') || ''

    const authToken = authContent.split(' ')[1]
    if (!authToken) {
      return res.status(400).json({ message: 'El token de inicio de sesión es requerido.' })
    }

    const verify = verifyJWT(authToken)
    if (!verify) {
      return res.status(400).json({ message: 'Token de inicio de sesión invalido.' })
    }

    const idUser = verify.data
    const role = await getUserRoleForId(idUser)
    if (!(['U', 'A', 'V'].includes(role))) {
      return res.status(400).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function authVeterinaryMiddleware (req, res, next) {
  try {
    const authContent = req.header('Authorization') || ''

    const authToken = authContent.split(' ')[1]
    if (!authToken) {
      return res.status(400).json({ message: 'El token de inicio de sesión es requerido.' })
    }

    const verify = verifyJWT(authToken)
    if (!verify) {
      return res.status(400).json({ message: 'Token de inicio de sesión invalido.' })
    }

    const idUser = verify.data
    const role = await getUserRoleForId(idUser)
    if (!(['A', 'V'].includes(role))) {
      return res.status(400).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function authAdminMiddleware (req, res, next) {
  try {
    const authContent = req.header('Authorization') || ''

    const authToken = authContent.split(' ')[1]
    if (!authToken) {
      return res.status(400).json({ message: 'El token de inicio de sesión es requerido.' })
    }

    const verify = verifyJWT(authToken)
    if (!verify) {
      return res.status(400).json({ message: 'Token de inicio de sesión invalido.' })
    }

    const idUser = verify.data
    const role = await getUserRoleForId(idUser)
    if (role !== 'A') {
      return res.status(400).json({ message: 'Sin autorización.' })
    }
    next()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

export { authUserMiddleware, authAdminMiddleware, authVeterinaryMiddleware }
