import { editUserPasswordForId } from '../../repositories/userRepository/editUserPasswordForId.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { hashPassword } from '../../utils/hashPassword.js'
import { passwordSchema } from '../../validations/passwordsSchema.js'

async function changePasswordController (req, res) {
  try {
    const authorization = req.header('Authorization')
    const idUser = await getAuthIdUser(authorization)

    const { password, repassword } = req.body

    // Validación con Joi
    await passwordSchema.validateAsync({ password, repassword })

    // Hashear la nueva contraseña
    const hashedPassword = await hashPassword(password)

    // Actualizar en la base de datos
    const result = await editUserPasswordForId(idUser, hashedPassword)

    if (result) {
      return res.status(200).json({ message: 'Contraseña actualizada correctamente.' })
    }

    throw new Error('No se pudo actualizar la contraseña.')
  } catch (error) {
    console.error('Error en cambio de contraseña:', error)

    const message =
      error.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado.')

    return res.status(400).json({ message })
  }
}

export { changePasswordController }
