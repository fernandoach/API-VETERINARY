import { getIdUserForEmail } from '../../repositories/userRepository/getIdUserForEmail.js'
import { getUserHashedPassword } from '../../repositories/userRepository/getUserHashedPassword.js'
import { getUserRoleForId } from '../../repositories/userRepository/getUserRoleForId.js'
import { signJWT } from '../../utils/signJWT.js'
import { validatePassword } from '../../utils/validatePassword.js'
import { loginSchema } from '../../validations/loginSchema.js'

async function authLoginController (req, res) {
  try {
    const { email, password } = req.body

    await loginSchema.validateAsync({ email, password })

    const idUser = await getIdUserForEmail(email)
    if (idUser === -1) {
      throw new Error('Usuario y/o contraseña inválidos.')
    }

    const hashedPassword = await getUserHashedPassword(idUser)
    if (hashedPassword === -1) {
      throw new Error('Usuario y/o contraseña inválidos.')
    }

    const isPasswordValid = await validatePassword(hashedPassword, password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Usuario y/o contraseña inválidos.' })
    }

    const accessToken = signJWT(idUser)
    const role = await getUserRoleForId(idUser)

    // TODO: Guardar token en base de datos para control de sesión
    return res.status(200).json({ accessToken, role })
  } catch (error) {
    console.error('Error en login:', 'Usuario y/o contraseña inválidos.')

    const message = 'Usuario y/o contraseña inválidos.'

    return res.status(400).json({ message })
  }
}

export { authLoginController }
