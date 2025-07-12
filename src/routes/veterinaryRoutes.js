import { Router } from 'express'
import { authVeterinaryMiddleware } from '../middlewares/authMiddlewares.js'
import { veterinaryCreateAppointmentController } from '../controllers/VeterinaryControllers/veterinaryCreateAppointmentController.js'
import { veterinaryCancelAppointmentController } from '../controllers/VeterinaryControllers/veterinaryCancelAppointmentController.js'
import { veterinaryCreatePetController } from '../controllers/VeterinaryControllers/veterinaryCreatePetController.js'
import { veterinaryEditAppointmentController } from '../controllers/VeterinaryControllers/veterinaryEditAppointmentController.js'
import { veterinaryEditPetController } from '../controllers/VeterinaryControllers/veterinaryEditPetController.js'
import { veterinaryViewPetsController } from '../controllers/VeterinaryControllers/veterinaryViewPetsController.js'
import { veterinaryCreateDiagnosticController } from '../controllers/VeterinaryControllers/veterinaryCreateDiagnosticController.js'
import { veterinaryEditDiagnosticController } from '../controllers/VeterinaryControllers/veterinaryEditDiagnosticController.js'
import { veterinaryViewDiagnosticController } from '../repositories/DiagnosticRepository/veterinaryViewDiagnosticController.js'
import { veterinaryDeleteDiagnosticController } from '../controllers/VeterinaryControllers/veterinaryDeleteDiagnosticController.js'
import { veterinaryViewAppointmentsController } from '../controllers/VeterinaryControllers/veterinaryViewAppointmentsController.js'

const veterinaryRouter = Router()

veterinaryRouter.post('/appointments', authVeterinaryMiddleware, veterinaryCreateAppointmentController)
veterinaryRouter.delete('/appointments/:idAppointment', authVeterinaryMiddleware, veterinaryCancelAppointmentController)
veterinaryRouter.put('/appointments/:idAppointment', authVeterinaryMiddleware, veterinaryEditAppointmentController)
veterinaryRouter.get('/appointments', authVeterinaryMiddleware, veterinaryViewAppointmentsController)

// TODO: FIX IT
veterinaryRouter.post('/pets', authVeterinaryMiddleware, veterinaryCreatePetController)
veterinaryRouter.get('/pets', authVeterinaryMiddleware, veterinaryViewPetsController)
veterinaryRouter.put('/pets', authVeterinaryMiddleware, veterinaryEditPetController)
veterinaryRouter.post('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryCreateDiagnosticController)
veterinaryRouter.put('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryEditDiagnosticController)
veterinaryRouter.get('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryViewDiagnosticController)
veterinaryRouter.delete('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryDeleteDiagnosticController)

export { veterinaryRouter }
