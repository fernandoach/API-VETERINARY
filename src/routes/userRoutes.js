import { Router } from 'express'
import { authUserMiddleware } from '../middlewares/authMiddlewares.js'
import { userRegisterController } from '../controllers/userControllers/userRegisterController.js'
import { userCreateAppointmentController } from '../controllers/userControllers/userCreateAppointmentController.js'
import { userCancelAppointmentController } from '../controllers/userControllers/userCancelAppointmentController.js'
import { userViewPetsController } from '../controllers/userControllers/userViewPetsController.js'
import { userViewDiagnosticController } from '../controllers/userControllers/userViewDiagnosticController.js'
import { userViewAppointmentsController } from '../controllers/userControllers/userViewAppointmentsController.js'
import { userViewVeterinariansController } from '../controllers/userControllers/userViewVeterinariansController.js'
import { userViewWeekScheduleController } from '../controllers/userControllers/userViewWeekScheduleController.js'

const userRouter = Router()

userRouter.post('/', userRegisterController)

userRouter.post('/appointments', authUserMiddleware, userCreateAppointmentController)
userRouter.delete('/appointments/:idAppointment', authUserMiddleware, userCancelAppointmentController)
userRouter.get('/appointments', authUserMiddleware, userViewAppointmentsController)
userRouter.get('/appointments/week', authUserMiddleware, userViewWeekScheduleController)

userRouter.get('/appointments/:idAppointment/diagnostic', authUserMiddleware, userViewDiagnosticController)

userRouter.get('/pets', authUserMiddleware, userViewPetsController)

userRouter.get('/veterinarians', authUserMiddleware, userViewVeterinariansController)

export { userRouter }
