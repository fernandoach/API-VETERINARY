import express from 'express'
import { getAuthUserInfoController, getUserInfoForIdController, loginController } from '../controllers/authControllers.js'

const authRouter = express.Router()

authRouter.post('/login', loginController)

authRouter.get('/getAuthIdUser', getUserInfoForIdController)

authRouter.get('/getAuthUserInfo', getAuthUserInfoController)

export { authRouter }
