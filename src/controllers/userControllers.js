import { addMinutes } from 'date-fns'
import { registerUser } from '../repositories/userRepository/registerUser.js'
import { hashPassword } from '../utils/hashPassword.js'
import { appointmentSchema } from '../validations/appointmentSchema.js'
import { userSchema } from '../validations/userSchema.js'
import { verifySchedule } from '../repositories/appointmentRepository/verifySchedule.js'
import { registerAppointment } from '../repositories/appointmentRepository/registerAppointment.js'

async function userRegisterController (req, res) {
  try {
    const { firstname, lastname, gender, birthday, dni, telephone, email, password, repassword } = req.body
    await userSchema.validateAsync({ firstname, lastname, gender, birthday, dni, telephone, email, password, repassword })

    const hashedPassword = await hashPassword(password)

    await registerUser(firstname, lastname, gender, birthday, dni, telephone, email, hashedPassword)

    return res.json({ message: 'Registrado con éxito' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function userCreateAppointmentController (req, res) {
  try {
    const { date, startTime, reason, idVeterinary, idPet } = req.body

    await appointmentSchema.validateAsync({ date, startTime, reason, state: 'P', idVeterinary, idPet })

    const [year, month, day] = date.split('-')
    const [hour, minutes] = startTime.split(':')
    const endTime = addMinutes(new Date(year, month, day, hour, minutes, 0), 60)
    const stateSchedule = await verifySchedule(date, idVeterinary, endTime, startTime)
    console.log(stateSchedule)
    if (stateSchedule) {
      await registerAppointment(date, startTime, endTime, reason, idVeterinary, idPet)
      return res.send({ message: `Cita registrada para: ${year}-${month}-${day} a las ${hour}:${minutes} hasta las ${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}` })
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

export { userRegisterController, userCreateAppointmentController }
