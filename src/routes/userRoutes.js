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

// Registro de usuario
userRouter.post('/', userRegisterController) // POST /user

// Appointments
userRouter.post('/appointments', authUserMiddleware, userCreateAppointmentController) // Crear cita
userRouter.delete('/appointments/:idAppointment', authUserMiddleware, userCancelAppointmentController) // Cancelar cita
userRouter.get('/appointments', authUserMiddleware, userViewAppointmentsController) // Ver todas las citas
userRouter.get('/appointments/week', authUserMiddleware, userViewWeekScheduleController) // Ver agenda semanal

// Diagnostics
userRouter.get('/appointments/:id/diagnostic', authUserMiddleware, userViewDiagnosticController) // Ver diagnóstico de una cita

// Pets
userRouter.get('/pets', authUserMiddleware, userViewPetsController) // Ver mascotas

// Veterinarians
userRouter.get('/veterinarians', authUserMiddleware, userViewVeterinariansController) // Ver veterinarios

export { userRouter }
