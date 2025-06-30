import { Router } from 'express'
import { userCancelAppointmentController, userCreateAppointmentController, userRegisterController, userViewAppointmentsController, userViewDiagnosticController, userViewPetsController, userViewVeterinariansController } from '../controllers/userControllers.js'
import { authUserMiddleware } from '../middlewares/authMiddlewares.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)
userRouter.post('/createAppointment', authUserMiddleware, userCreateAppointmentController)
userRouter.put('/cancelAppointment', authUserMiddleware, userCancelAppointmentController)
userRouter.get('/viewPets', authUserMiddleware, userViewPetsController)
userRouter.get('/viewDiagnostic', authUserMiddleware, userViewDiagnosticController)
userRouter.get('/viewAppointments', authUserMiddleware, userViewAppointmentsController)
userRouter.get('/viewVeterinarians', authUserMiddleware, userViewVeterinariansController)

export { userRouter }
