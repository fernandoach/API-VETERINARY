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
import { veterinaryViewDiagnosticController } from '../controllers/VeterinaryControllers/veterinaryViewDiagnosticController.js'
import { veterinaryDeleteDiagnosticController } from '../controllers/VeterinaryControllers/veterinaryDeleteDiagnosticController.js'
import { veterinaryViewAppointmentsController } from '../controllers/VeterinaryControllers/veterinaryViewAppointmentsController.js'
import { veterinaryDeletePetController } from '../controllers/VeterinaryControllers/veterinaryDeletePetController.js'

const veterinaryRouter = Router()

veterinaryRouter.post('/appointments', authVeterinaryMiddleware, veterinaryCreateAppointmentController)
veterinaryRouter.get('/appointments', authVeterinaryMiddleware, veterinaryViewAppointmentsController)
veterinaryRouter.put('/appointments/:idAppointment', authVeterinaryMiddleware, veterinaryEditAppointmentController)
veterinaryRouter.delete('/appointments/:idAppointment', authVeterinaryMiddleware, veterinaryCancelAppointmentController)

veterinaryRouter.post('/pets', authVeterinaryMiddleware, veterinaryCreatePetController)
veterinaryRouter.get('/pets/:idUser', authVeterinaryMiddleware, veterinaryViewPetsController)
veterinaryRouter.put('/pets/:idPet', authVeterinaryMiddleware, veterinaryEditPetController)
veterinaryRouter.delete('/pets/:idPet', authVeterinaryMiddleware, veterinaryDeletePetController)

veterinaryRouter.post('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryCreateDiagnosticController)
veterinaryRouter.get('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryViewDiagnosticController)
veterinaryRouter.put('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryEditDiagnosticController)
veterinaryRouter.delete('/diagnostics/:idAppointment', authVeterinaryMiddleware, veterinaryDeleteDiagnosticController)

export { veterinaryRouter }
