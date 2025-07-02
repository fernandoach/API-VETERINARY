import { Router } from 'express'
import { authVeterinaryMiddleware } from '../middlewares/authMiddlewares.js'
import { veterinaryCancelAppointmentController, veterinaryCreateAppointmentController, veterinaryCreatePetController, veterinaryEditAppointmentController, veterinaryEditPetController, veterinaryViewPetsController } from '../controllers/veterinaryControllers.js'

const veterinaryRouter = Router()

veterinaryRouter.post('/createAppointment', authVeterinaryMiddleware, veterinaryCreateAppointmentController)
veterinaryRouter.put('/cancelAppointment', authVeterinaryMiddleware, veterinaryCancelAppointmentController)
veterinaryRouter.post('/createPet', authVeterinaryMiddleware, veterinaryCreatePetController)
veterinaryRouter.get('/viewPets', authVeterinaryMiddleware, veterinaryViewPetsController)
veterinaryRouter.put('/editAppointment', authVeterinaryMiddleware, veterinaryEditAppointmentController)
veterinaryRouter.put('/editPet', authVeterinaryMiddleware, veterinaryEditPetController)

export { veterinaryRouter }
