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
    if (idUser === -1) throw new Error('Usuario y/o contraseña inválidos.')

    const hashedPassword = await getUserHashedPassword(idUser)
    if (hashedPassword === -1) throw new Error('Usuario y/o contraseña inválidos.')

    const isPasswordValid = await validatePassword(hashedPassword, password)
    if (!isPasswordValid) throw new Error('Usuario y/o contraseña inválidos.')

    const accessToken = signJWT(idUser)

    const isProduction = process.env.ENVIRONMENT === 'production'

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'Strict',
      maxAge: 2 * 60 * 60 * 1000
    })
    const role = await getUserRoleForId(idUser)

    return res.status(200).json({ role })
  } catch (error) {
    console.error('Error en login:', error)
    return res.status(400).json({ message: 'Usuario y/o contraseña inválidos.' })
  }
}

export { authLoginController }
