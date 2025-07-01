import { Router } from 'express'
import { authVeterinaryMiddleware } from '../middlewares/authMiddlewares.js'
import { veterinaryCancelAppointmentController, veterinaryCreateAppointmentController, veterinaryCreatePetController, veterinaryViewPetsController } from '../controllers/veterinaryControllers.js'

const veterinaryRouter = Router()

veterinaryRouter.post('/createAppointment', authVeterinaryMiddleware, veterinaryCreateAppointmentController)
veterinaryRouter.put('/cancelAppointment', authVeterinaryMiddleware, veterinaryCancelAppointmentController)
veterinaryRouter.post('/createPet', authVeterinaryMiddleware, veterinaryCreatePetController)
veterinaryRouter.post('/viewPets', authVeterinaryMiddleware, veterinaryViewPetsController)

export { veterinaryRouter }
