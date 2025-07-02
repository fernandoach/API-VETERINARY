import { addMinutes, compareAsc, differenceInMinutes, isBefore, isSameDay } from 'date-fns'
import { getAuthIdUser } from '../utils/getAuthIdUser.js'
import { appointmentSchema } from '../validations/appointmentSchema.js'
import { verifySchedule } from '../repositories/appointmentRepository/verifySchedule.js'
import { registerAppointment } from '../repositories/appointmentRepository/registerAppointment.js'
import { validateVeterinaryAppointment } from '../repositories/veterinaryRepository/validateVeterinaryAppointment.js'
import { getAppointmentDateTimeForIds } from '../repositories/veterinaryRepository/getAppointmentDateTimeForIds.js'
import { cancelVeterinaryAppointment } from '../repositories/veterinaryRepository/cancelVeterinaryAppointment.js'
import { petSchema } from '../validations/petSchema.js'
import { getIdUserForDni } from '../repositories/userRepository/getIdUserForDni.js'
import { registerPet } from '../repositories/petRepository/registerPet.js'
import { validateExistUser } from '../repositories/userRepository/validateExistUser.js'
import { viewPetsForIdUser } from '../repositories/petRepository/viewPetsForIdUser.js'
import { editAppointmentForId } from '../repositories/appointmentRepository/editAppointmentForId.js'

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

async function veterinaryCancelAppointmentController (req, res) {
  try {
    const { idAppointment } = req.body
    const idVeterinary = await getAuthIdUser(req)
    const cancelStatus = await validateVeterinaryAppointment(idVeterinary, idAppointment)

    const appointmentQuery = await getAppointmentDateTimeForIds(idAppointment, idVeterinary)

    if (typeof appointmentQuery === 'undefined') {
      throw new Error('Sin autorizzación. ')
    }
    const appointmentDate = appointmentQuery.date

    if (isSameDay(new Date(appointmentDate), Date.now())) {
      return res.status(400).send({ message: 'No puede cancelar el mismo día de la cita.' })
    }
    const compareDate = compareAsc(new Date(appointmentDate), new Date(Date.now()))

    if (compareDate === -1) {
      return res.status(400).send({ message: 'No puede cancelar una cita de fecha pasada.' })
    }

    if (cancelStatus) {
      const cancelAppointmentResult = await cancelVeterinaryAppointment(idAppointment)
      return cancelAppointmentResult ? res.send({ message: `Cita de id: ${idAppointment} cancelada con éxito. ` }) : res.status(400).send({ message: 'La cita ya esta cancelada o ya fue completada. ' })
    }

    return res.send(cancelStatus)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function veterinaryCreatePetController (req, res) {
  try {
    const { name, species, race, gender, weight, birthday, dni } = req.body
    await petSchema.validateAsync({ name, species, race, gender, weight, birthday, dni })

    const compareDate = compareAsc(new Date(birthday), new Date(Date.now()))

    if (compareDate === 1) {
      return res.status(400).send({ message: 'La fecha de nacimiento no puede ser una fecha posterior a hoy' })
    }

    const idOwner = await getIdUserForDni(dni)

    if (idOwner === -1) {
      return res.status(400).send({ message: 'El dni debe ser valido' })
    }

    const insertResult = await registerPet(name, species, race, gender, weight, birthday, idOwner)

    return insertResult.affectedRows === 1 ? res.send({ message: 'Registrado con éxito' }) : res.status(400).send({ message: 'No se pudo registrar la mascota.' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function veterinaryViewPetsController (req, res) {
  try {
    const { idUser } = req.body
    // TODO: validar usuario existente
    const validateUser = await validateExistUser(idUser)
    if (validateUser === false) {
      return res.status(400).send({ message: 'El usuario no existe.' })
    }
    // TODO: obtener mascotas por idUser
    const myPets = await viewPetsForIdUser(idUser)

    if (myPets.length === 0) return res.status(400).send({ message: 'El cliente aun no tiene mascotas registradas. ' })
    return res.send({ pets: myPets })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado. ' })
  }
}

async function veterinaryEditAppointmentController (req, res) {
  try {
    const { idAppointment, date, startTime, idPet, reason, state } = req.body
    const idVeterinary = await getAuthIdUser(req)

    await appointmentSchema.validateAsync({ date, startTime, reason, state, idVeterinary, idPet })

    const validateAppointment = await validateVeterinaryAppointment(idVeterinary, idAppointment)

    if (!validateAppointment) {
      return res.status(400).send({ message: 'Sin autorización.' })
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hour, minutes] = startTime.split(':').map(Number)

    const appointmentDate = new Date(year, month - 1, day, hour, minutes)

    const endTime = addMinutes(appointmentDate, 60)

    const queryResult = await editAppointmentForId(idAppointment, date, startTime, endTime, reason, idPet, idVeterinary)

    if (!queryResult) {
      return res.status(400).send({ message: 'No se pudo modificar la cita.' })
    }

    return res.send({ message: 'Cita editada correctamente.' })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado. ' })
  }
}

export { veterinaryCreateAppointmentController, veterinaryCancelAppointmentController, veterinaryCreatePetController, veterinaryViewPetsController, veterinaryEditAppointmentController }
