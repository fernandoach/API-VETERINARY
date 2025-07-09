import express from 'express'
import { authUserMiddleware } from '../middlewares/authMiddlewares.js'
import { authLoginController } from '../controllers/authControllers/authLoginController.js'
import { getAuthUserInfoController } from '../controllers/authControllers/authGetUserInfoController.js'
import { changePasswordController } from '../controllers/authControllers/authChangePasswordController.js'
import { authLogoutController } from '../controllers/authControllers/authLogoutController.js'

const authRouter = express.Router()

authRouter.post('/login', authLoginController)
authRouter.get('/getAuthUserInfo', authUserMiddleware, getAuthUserInfoController)
authRouter.put('/changePassword', authUserMiddleware, changePasswordController)
authRouter.put('/logout', authUserMiddleware, authLogoutController)

export { authRouter }
