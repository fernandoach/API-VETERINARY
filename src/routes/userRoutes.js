import { Router } from 'express'
import { authUserMiddleware } from '../middlewares/authMiddlewares.js'
import { userRegisterController } from '../controllers/userControllers/userRegisterController.js'
import { userCreateAppointmentController } from '../controllers/userControllers/userCreateAppointmentController.js'
import { userCancelAppointmentController } from '../controllers/userControllers/userCancelAppointmentController.js'
import { userViewPetsController } from '../controllers/userControllers/userViewPetsController.js'
import { userViewDiagnosticController } from '../controllers/userControllers/userViewDiagnosticController.js'
import { userViewAppointmentsController } from '../controllers/userControllers/userViewAppointmentsController.js'
import { userViewVeterinariansController } from '../controllers/userControllers/userViewVeterinariansController.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)
userRouter.post('/createAppointment', authUserMiddleware, userCreateAppointmentController)
userRouter.put('/cancelAppointment', authUserMiddleware, userCancelAppointmentController)
userRouter.get('/viewPets', authUserMiddleware, userViewPetsController)
userRouter.get('/viewDiagnostic', authUserMiddleware, userViewDiagnosticController)
userRouter.get('/viewAppointments', authUserMiddleware, userViewAppointmentsController)
userRouter.get('/viewVeterinarians', authUserMiddleware, userViewVeterinariansController)

export { userRouter }
