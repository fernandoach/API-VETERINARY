import { addMinutes, differenceInMinutes, isBefore } from 'date-fns'
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

    // Validar que la cita no esté en el pasado ni muy cerca (menos de 2 horas)
    if (isBefore(start, now) || differenceInMinutes(start, now) < 120) {
      return res.status(400).json({ message: 'No puede reservar en una fecha pasada o con menos de 2 horas de anticipación.' })
    }

    // Calcular la hora de finalización sumando 60 minutos
    const end = addMinutes(start, 60)

    // Verificar que el horario no esté ocupado
    const available = await verifyAppointmentDate(date, idVeterinary, end, startTime)

    if (!available) {
      return res.status(400).json({ message: 'Horario con el veterinario seleccionado no disponible.' })
    }

    // Registrar la cita si el horario está disponible
    await registerAppointment(date, startTime, end, reason, idVeterinary, idPet)

    // Formatear la hora final
    const formattedEndTime = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`

    // Enviar respuesta con confirmación
    return res.status(200).json({
      message: `Cita registrada para el ${date} de ${startTime} a ${formattedEndTime}`
    })
  } catch (error) {
    // Manejo de errores de Joi u otros errores
    const message =
      error?.details?.[0]?.message || (error instanceof Error ? error.message : 'Error inesperado')
    return res.status(400).json({ message })
  }
}

export { veterinaryCreateAppointmentController }
