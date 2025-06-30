import { Router } from 'express'
import { userCancelAppointmentController, userCreateAppointmentController, userGetPetsController, userRegisterController, userViewAppointmentsController, userViewDiagnosticController } from '../controllers/userControllers.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)
userRouter.post('/appointment', userCreateAppointmentController)
userRouter.put('/cancelAppointment', userCancelAppointmentController)
userRouter.get('/viewPets', userGetPetsController)
userRouter.get('/viewDiagnostic', userViewDiagnosticController)
userRouter.get('/viewAppointments', userViewAppointmentsController)

export { userRouter }
