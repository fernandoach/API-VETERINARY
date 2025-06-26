import express from 'express'
import { changePasswordController, getAuthUserInfoController, getUserInfoForIdController, loginController } from '../controllers/authControllers.js'
import { authUserMiddleware } from '../middlewares/authMiddlewares.js'

const authRouter = express.Router()

authRouter.post('/login', loginController)

authRouter.get('/getAuthIdUser', authUserMiddleware, getUserInfoForIdController)

authRouter.get('/getAuthUserInfo', authUserMiddleware, getAuthUserInfoController)

authRouter.put('/changePassword', authUserMiddleware, changePasswordController)

export { authRouter }
