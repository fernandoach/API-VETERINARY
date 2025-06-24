import express from 'express'
import { loginController } from '../controllers/loginControllers.js'
import { verifyJWT } from '../utils/verifyJWT.js'

const authRouter = express.Router()

authRouter.post('/login', loginController)

authRouter.get('/getAuthIdUser', async (req, res) => {
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
    return res.json({ idUser })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
})

export { authRouter }
