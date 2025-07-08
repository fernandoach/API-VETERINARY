import { getAppointmentsForIdUser } from '../../repositories/appointmentRepository/getAppointmentsForIdUser.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'

async function userViewAppointmentsController (req, res) {
  try {
    // Obtener token de autorización del encabezado
    const authorization = req.header('Authorization')

    // Obtener el ID del usuario a partir del token
    const idUser = await getAuthIdUser(authorization)

    // Obtener las citas correspondientes al usuario
    const appointments = await getAppointmentsForIdUser(idUser)

    // Enviar las citas como respuesta
    return res.status(200).json({ appointments })
  } catch (error) {
    console.error('Error al obtener citas del usuario:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { userViewAppointmentsController }
