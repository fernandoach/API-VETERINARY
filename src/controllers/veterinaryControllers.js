import { addMinutes, differenceInMinutes, isBefore } from 'date-fns'
import { getAuthIdUser } from '../utils/getAuthIdUser.js'
import { appointmentSchema } from '../validations/appointmentSchema.js'
import { verifySchedule } from '../repositories/appointmentRepository/verifySchedule.js'
import { registerAppointment } from '../repositories/appointmentRepository/registerAppointment.js'

async function veterinaryCreateAppointmentController (req, res) {
  try {
    const { date, startTime, reason, idPet } = req.body
    const idVeterinary = await getAuthIdUser(req)

    await appointmentSchema.validateAsync({ date, startTime, reason, state: 'P', idVeterinary, idPet })

    const [year, month, day] = date.split('-').map(Number)
    const [hour, minutes] = startTime.split(':').map(Number)

    const appointmentDate = new Date(year, month - 1, day, hour, minutes)
    const now = new Date()

    // Verifica si la fecha es pasada o si faltan menos de 2 horas
    if (isBefore(appointmentDate, now) || differenceInMinutes(appointmentDate, now) < 120) {
      return res.status(400).send({ message: 'No puede reservar en una fecha pasada o con menos de 2 horas de anticipación.' })
    }

    const endTime = addMinutes(appointmentDate, 60)

    const stateSchedule = await verifySchedule(date, idVeterinary, endTime, startTime)

    if (stateSchedule) {
      await registerAppointment(date, startTime, endTime, reason, idVeterinary, idPet)
      return res.send({ message: `Cita registrada para: ${date} a las ${startTime} hasta las ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}` })
    } else {
      return res.status(400).send({ message: 'Horario con el veterinario seleccionado no disponible.' })
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

export { veterinaryCreateAppointmentController }
