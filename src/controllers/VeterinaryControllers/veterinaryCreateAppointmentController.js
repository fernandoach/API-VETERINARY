import { addMinutes, isBefore, isSameDay } from 'date-fns'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { appointmentSchema } from '../../validations/appointmentSchema.js'
import { registerAppointment } from '../../repositories/appointmentRepository/registerAppointment.js'
import { verifyAppointmentDate } from '../../repositories/appointmentRepository/verifyAppointmentDate.js'

async function veterinaryCreateAppointmentController (req, res) {
  try {
    // Obtener el ID del veterinario autenticado desde el request
    const idVeterinary = await getAuthIdUser(req)

    // Extraer datos del cuerpo de la solicitud
    const { date, startTime, reason, idPet } = req.body

    // Validar los datos usando Joi
    await appointmentSchema.validateAsync({ date, startTime, reason, state: 'P', idVeterinary, idPet })

    // Convertir la fecha y hora a objeto Date
    const [year, month, day] = date.split('-').map(Number)
    const [hour, minute] = startTime.split(':').map(Number)
    const start = new Date(year, month - 1, day, hour, minute)
    const now = new Date()

    // Validar que la cita no esté en el una fecha pasada, pero si es el mismo dia y hora pasada nomarl
    if (isBefore(start, now) && !isSameDay(start, now)) {
      return res.status(400).json({ message: 'No se pueden registrar citas en días pasados.' })
    }

    // Calcular la hora de finalización sumando 60 minutos
    const endTime = addMinutes(start, 60)

    // Verificar que el horario no esté ocupado
    const available = await verifyAppointmentDate(date, idVeterinary, endTime, startTime)

    if (!available) {
      return res.status(400).json({ message: 'Horario con el veterinario seleccionado no disponible.' })
    }

    // Registrar la cita si el horario está disponible
    await registerAppointment(date, startTime, endTime, reason, idVeterinary, idPet)

    // Formatear la hora final
    const formattedEndTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`

    // Enviar respuesta con confirmación
    return res.status(200).json({
      message: `Cita registrada para el ${date} de ${startTime} a ${formattedEndTime}`
    })
  } catch (error) {
    const message =
      error?.details?.[0]?.message || (error instanceof Error ? error.message : 'Error inesperado')
    return res.status(400).json({ message })
  }
}

export { veterinaryCreateAppointmentController }
