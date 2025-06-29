import { Router } from 'express'
import { userCancelAppointmentController, userCreateAppointmentController, userRegisterController } from '../controllers/userControllers.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)
userRouter.post('/appointment', userCreateAppointmentController)
userRouter.put('/cancelAppointment', userCancelAppointmentController)

export { userRouter }
