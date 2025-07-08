import { registerUser } from '../../repositories/userRepository/registerUser.js'
import { hashPassword } from '../../utils/hashPassword.js'
import { userSchema } from '../../validations/userSchema.js'

async function userRegisterController (req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const {
      firstname,
      lastname,
      gender,
      birthday,
      dni,
      telephone,
      email,
      password,
      repassword
    } = req.body

    // Validar los datos de entrada con el esquema definido
    await userSchema.validateAsync({
      firstname,
      lastname,
      gender,
      birthday,
      dni,
      telephone,
      email,
      password,
      repassword
    })

    // Encriptar la contraseña del usuario antes de guardarla
    const hashedPassword = await hashPassword(password)

    // Registrar al usuario en la base de datos
    await registerUser(
      firstname,
      lastname,
      gender,
      birthday,
      dni,
      telephone,
      email,
      hashedPassword
    )

    // Responder con éxito
    return res.status(201).json({ message: 'Registrado con éxito.' })
  } catch (error) {
    // Log para desarrollo
    console.error('Error al registrar usuario:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { userRegisterController }
