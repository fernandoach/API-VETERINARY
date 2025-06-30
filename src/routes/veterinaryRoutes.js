import { Router } from 'express'
import { authVeterinaryMiddleware } from '../middlewares/authMiddlewares.js'
import { veterinaryCreateAppointmentController } from '../controllers/veterinaryControllers.js'

const veterinaryRouter = Router()

veterinaryRouter.post('/createAppointment', authVeterinaryMiddleware, veterinaryCreateAppointmentController)

export { veterinaryRouter }
