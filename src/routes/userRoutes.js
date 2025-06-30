import { Router } from 'express'
import { userCancelAppointmentController, userCreateAppointmentController, userGetPetsController, userRegisterController } from '../controllers/userControllers.js'
import { getDiagnosticForIds } from '../repositories/userRepository/getDignosticForIds.js'
import { getAuthIdUser } from '../utils/getAuthIdUser.js'

const userRouter = Router()

userRouter.post('/register', userRegisterController)
userRouter.post('/appointment', userCreateAppointmentController)
userRouter.put('/cancelAppointment', userCancelAppointmentController)
userRouter.get('/viewPets', userGetPetsController)
userRouter.get('/viewDiagnostic', async function userViewDiagnosticController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    const { idAppointment } = req.body

    const result = await getDiagnosticForIds(idUser, idAppointment)

    // TODO: Validar que sea el usuario el due;o de la cita

    return res.send({ diagnostics: result })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
})

export { userRouter }
