import { addMinutes, differenceInMinutes, isBefore } from 'date-fns'
import { appointmentSchema } from '../../validations/appointmentSchema.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { registerAppointment } from '../../repositories/appointmentRepository/registerAppointment.js'
import { verifyAppointmentDate } from '../../repositories/appointmentRepository/verifyAppointmentDate.js'
import { doesPetBelongToIdUser } from '../../repositories/petRepository/doesPetBelongToIdUser.js'

async function userCreateAppointmentController (req, res) {
  try {
    const { date, startTime, reason, idVeterinary, idPet } = req.body

    const authorization = req.header('Authorization')
    const idUser = await getAuthIdUser(authorization)

    await appointmentSchema.validateAsync({
      date,
      startTime,
      reason,
      state: 'P',
      idVeterinary,
      idPet
    })

    const [year, month, day] = date.split('-').map(Number)
    const [hour, minutes] = startTime.split(':').map(Number)

    const startDate = new Date(year, month - 1, day, hour, minutes)
    const endDate = addMinutes(startDate, 60)
    const now = new Date()

    // Validar que no se pueda reservar en el pasado o con menos de 2 horas
    if (isBefore(startDate, now) || differenceInMinutes(startDate, now) < 120) {
      return res.status(400).json({
        message: 'No puede reservar en una fecha pasada o con menos de 2 horas de anticipación.'
      })
    }

    // Verificar que la mascota le pertenezca al usuario autenticado
    const isPetValid = await doesPetBelongToIdUser(idPet, idUser)
    if (!isPetValid) {
      return res.status(400).json({ message: 'Mascota o veterinario no existentes.' })
    }

    // Verificar disponibilidad del horario con el veterinario
    const isSlotAvailable = await verifyAppointmentDate(date, idVeterinary, endDate, startTime)
    if (!isSlotAvailable) {
      return res.status(400).json({
        message: 'Horario con el veterinario seleccionado no disponible.'
      })
    }

    // TODO: Evitar doble registro en el mismo minuto exacto si se hacen peticiones simultáneas

    await registerAppointment(date, startTime, endDate, reason, idVeterinary, idPet)

    const formattedEnd = `${endDate.getHours().toString().padStart(2, '0')}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`

    return res.status(200).json({
      message: `Cita registrada para: ${date} de ${startTime} a ${formattedEnd}`
    })
  } catch (error) {
    console.error('Error al crear cita:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { userCreateAppointmentController }
