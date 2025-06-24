import { Router } from 'express'
import { userCreateAppointmentController, userRegisterController } from '../controllers/userControllers.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)

userRouter.post('/appointment', userCreateAppointmentController)

export { userRouter }
