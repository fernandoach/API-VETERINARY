import { addMinutes, compareAsc, differenceInMinutes, isBefore, isSameDay } from 'date-fns'
import { registerUser } from '../repositories/userRepository/registerUser.js'
import { hashPassword } from '../utils/hashPassword.js'
import { appointmentSchema } from '../validations/appointmentSchema.js'
import { userSchema } from '../validations/userSchema.js'
import { verifySchedule } from '../repositories/appointmentRepository/verifySchedule.js'
import { registerAppointment } from '../repositories/appointmentRepository/registerAppointment.js'
import { cancelAppointmentForId } from '../repositories/appointmentRepository/cancelAppointmentForId.js'
import { getAuthIdUser } from '../utils/getAuthIdUser.js'
import { getPetsForId } from '../repositories/userRepository/getPetsForId.js'
import { getDiagnosticForIds } from '../repositories/userRepository/getDignosticForIds.js'
import { getAppointmentDateTimeForIds } from '../repositories/appointmentRepository/getAppointmentDateTimeForIds.js'
import { getAppointmentsForUserId } from '../repositories/userRepository/getAppointmentsForUserId.js'
import { getVeterinarians } from '../repositories/userRepository/getVeterinarians.js'
import { validatePetForIds } from '../repositories/veterinaryRepository/validatePetForIds.js'

async function userRegisterController (req, res) {
  try {
    const { firstname, lastname, gender, birthday, dni, telephone, email, password, repassword } = req.body
    await userSchema.validateAsync({ firstname, lastname, gender, birthday, dni, telephone, email, password, repassword })

    const hashedPassword = await hashPassword(password)

    await registerUser(firstname, lastname, gender, birthday, dni, telephone, email, hashedPassword)

    return res.send({ message: 'Registrado con éxito' })
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

    const appointmentDate = new Date(year, month - 1, day, hour, minutes)
    const now = new Date()

    // Verifica si la fecha es pasada o si faltan menos de 2 horas
    if (isBefore(appointmentDate, now) || differenceInMinutes(appointmentDate, now) < 120) {
      return res.status(400).send({ message: 'No puede reservar en una fecha pasada o con menos de 2 horas de anticipación.' })
    }

    const idUser = await getAuthIdUser(req)
    const validatePet = await validatePetForIds(idPet, idUser)

    if (validatePet === 0) {
      return res.status(400).send({ message: 'Mascota o veterinario no existentes.' })
    }

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

async function userCancelAppointmentController (req, res) {
  try {
    const { idAppointment } = req.body
    const idUser = await getAuthIdUser(req)
    const appointmentDateTime = await getAppointmentDateTimeForIds(idAppointment, idUser) // { date, startTime, endTime }
    const appointmentDate = (appointmentDateTime.date)
    if (isSameDay(new Date(appointmentDate), Date.now())) {
      return res.status(400).send({ message: 'No puede cancelar el mismo día de la cita.' })
    }
    const compareDate = compareAsc(new Date(appointmentDate), new Date(Date.now()))

    if (compareDate === -1) {
      return res.status(400).send({ message: 'No puede cancelar una cita de fecha pasada.' })
    }

    const result = await cancelAppointmentForId(idAppointment)

    switch (result) {
      case 0:
        return res.status(400).send({ message: 'Cita ya fue cancelada previamente.' })
      case 1:
        return res.status(200).send({ message: 'Cita cancelada con exito.' })
    }
    throw new Error('No se pudo cancelar la cita.')
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function userViewPetsController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    const pets = await getPetsForId(idUser)
    return res.send({ pets })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function userViewDiagnosticController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    const { idAppointment } = req.body

    const result = await getDiagnosticForIds(idUser, idAppointment)

    return res.send({ diagnostics: result })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function userViewAppointmentsController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)

    const result = await getAppointmentsForUserId(idUser)

    return res.send({ appointments: result })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function userViewVeterinariansController (req, res) {
  try {
    const result = await getVeterinarians()

    return res.send({ appointments: result })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

export { userRegisterController, userCreateAppointmentController, userCancelAppointmentController, userViewPetsController, userViewDiagnosticController, userViewAppointmentsController, userViewVeterinariansController }
