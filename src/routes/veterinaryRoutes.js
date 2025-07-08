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

const veterinaryRouter = Router()

veterinaryRouter.post('/createAppointment', authVeterinaryMiddleware, veterinaryCreateAppointmentController)
veterinaryRouter.put('/cancelAppointment', authVeterinaryMiddleware, veterinaryCancelAppointmentController)
veterinaryRouter.post('/createPet', authVeterinaryMiddleware, veterinaryCreatePetController)
veterinaryRouter.get('/viewPets', authVeterinaryMiddleware, veterinaryViewPetsController)
veterinaryRouter.put('/editAppointment', authVeterinaryMiddleware, veterinaryEditAppointmentController)
veterinaryRouter.put('/editPet', authVeterinaryMiddleware, veterinaryEditPetController)
veterinaryRouter.post('/createDiagnostic/:idAppointment', authVeterinaryMiddleware, veterinaryCreateDiagnosticController)
veterinaryRouter.put('/editDiagnostic/:idAppointment', authVeterinaryMiddleware, veterinaryEditDiagnosticController)
veterinaryRouter.get('/viewDiagnostic/:idAppointment', authVeterinaryMiddleware, veterinaryViewDiagnosticController)
veterinaryRouter.delete('/deleteDiagnostic/:idAppointment', authVeterinaryMiddleware, veterinaryDeleteDiagnosticController)

export { veterinaryRouter }
