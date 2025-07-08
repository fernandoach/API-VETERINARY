import { compareAsc, isSameDay } from 'date-fns'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { cancelAppointmentForId } from '../../repositories/appointmentRepository/cancelAppointmentForId.js'
import { getAppointmentDateTimeForUserAppointment } from '../../repositories/appointmentRepository/getAppointmentDateTimeForUserAppointment.js'

async function userCancelAppointmentController (req, res) {
  try {
    const authorization = req.header('Authorization')
    const idUser = await getAuthIdUser(authorization)

    const { idAppointment } = req.body

    // Verificar que la cita pertenezca al usuario autenticado
    const appointmentDateTime = await getAppointmentDateTimeForUserAppointment(idUser, idAppointment)
    if (!appointmentDateTime) {
      return res.status(404).json({ message: 'Cita no encontrada o no pertenece al usuario.' })
    }

    const appointmentDate = new Date(appointmentDateTime.date)
    const today = new Date()

    // Validar que no se pueda cancelar el mismo día
    if (isSameDay(appointmentDate, today)) {
      return res.status(400).json({ message: 'No puede cancelar el mismo día de la cita.' })
    }

    // Validar que no se pueda cancelar una cita en el pasado
    if (compareAsc(appointmentDate, today) === -1) {
      return res.status(400).json({ message: 'No puede cancelar una cita de fecha pasada.' })
    }

    // TODO: En el futuro considerar cancelación con penalidad

    // Cancelar la cita
    const result = await cancelAppointmentForId(idAppointment)
    if (result) {
      return res.status(200).json({ message: 'Cita cancelada con éxito.' })
    } else {
      return res.status(400).json({ message: 'La cita ya fue cancelada previamente.' })
    }
  } catch (error) {
    console.error('Error al cancelar cita:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { userCancelAppointmentController }
