import express from 'express'
import { loginController } from '../controllers/loginControllers.js'

const authRouter = express.Router()

authRouter.post('/login', loginController)

export { authRouter }
