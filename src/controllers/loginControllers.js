import { getIdUserForEmail } from '../repositories/userRepository/getIdUserForEmail.js'
import { getUserHashedPassword } from '../repositories/userRepository/getUserHashedPassword.js'
import { signJWT } from '../utils/signJWT.js'
import { validatePassword } from '../utils/validatePassword.js'

async function loginController (req, res) {
  try {
    const { email, password } = req.body

    const idUser = await getIdUserForEmail(email)
    if (idUser === -1) throw new Error('Usuario y/o contraseña invalidos.')

    const userPassword = await getUserHashedPassword(idUser)
    if (userPassword === -1) throw new Error('Usuario y/o contraseña invalidos.')

    const validation = await validatePassword(userPassword, password)
    if (validation) {
      const jwt = signJWT(idUser)
      return res.json({ accesToken: jwt })
    } else {
      return res.status(400).json({ message: 'Usuario y/o contraseña invalidos.' })
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

export { loginController }
