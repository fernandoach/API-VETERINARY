import { Router } from 'express'
import { registerUserRepository } from '../repositories/userRepository/registerUserRepository.js'
import { userSchema } from '../validations/userSchema.js'
import { hashPassword } from '../utils/hashPassword.js'

const userRouter = Router()

userRouter.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, gender, birthday, dni, telephone, email, password, repassword } = req.body
    await userSchema.validateAsync({ firstname, lastname, gender, birthday, dni, telephone, email, password, repassword })

    const hashedPassword = await hashPassword(password)

    await registerUserRepository(firstname, lastname, gender, birthday, dni, telephone, email, hashedPassword)

    return res.json({ message: 'Registrado con éxito' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
})

export { userRouter }
