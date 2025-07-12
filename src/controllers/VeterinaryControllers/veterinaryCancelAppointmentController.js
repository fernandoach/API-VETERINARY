import { compareAsc, isSameDay } from 'date-fns'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { getAppointmentDateTimeForVeterinaryAppointment } from '../../repositories/appointmentRepository/getAppointmentDateTimeForVeterinaryAppointment.js'
import { cancelAppointmentForId } from '../../repositories/appointmentRepository/cancelAppointmentForId.js'
import { validateAppointmentForIdVeterinary } from '../../repositories/appointmentRepository/validateAppointmentForIdVeterinary.js'

async function veterinaryCancelAppointmentController (req, res) {
  try {
    const idVeterinary = await getAuthIdUser(req)

    const idAppointment = req.params.idAppointment

    if (!idAppointment) {
      return res.status(400).json({ message: 'ID de cita no proporcionado.' })
    }

    // Verifica que la cita pertenezca al veterinario
    const isOwner = await validateAppointmentForIdVeterinary(idVeterinary, idAppointment)
    if (!isOwner) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta cita.' })
    }

    // Obtener la fecha y hora de la cita
    const appointmentQuery = await getAppointmentDateTimeForVeterinaryAppointment(idVeterinary, idAppointment)
    if (!appointmentQuery) {
      return res.status(404).json({ message: 'No se encontró la cita.' })
    }

    const appointmentDate = new Date(appointmentQuery.date)
    const now = new Date()

    // Verificar que no sea el mismo día
    if (isSameDay(appointmentDate, now)) {
      return res.status(400).json({ message: 'No puede cancelar el mismo día de la cita.' })
    }

    // Verificar que no sea de una fecha pasada
    if (compareAsc(appointmentDate, now) === -1) {
      return res.status(400).json({ message: 'No puede cancelar una cita de fecha pasada.' })
    }

    // Cancelar la cita
    const cancelResult = await cancelAppointmentForId(idAppointment)

    // Validar si la cita ya fue cancelada anteriormente o esta completada
    if (!cancelResult) {
      return res.status(400).json({ message: 'La cita ya está cancelada o fue completada.' })
    }

    return res.status(200).json({ message: 'Cita cancelada con éxito.' })
  } catch (error) {
    console.error('Error al cancelar cita veterinaria:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { veterinaryCancelAppointmentController }
