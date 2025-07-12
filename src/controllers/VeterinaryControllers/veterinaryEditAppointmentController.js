import { addMinutes, isSameHour } from 'date-fns'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { editAppointmentForId } from '../../repositories/appointmentRepository/editAppointmentForId.js'
import { appointmentSchema } from '../../validations/appointmentSchema.js'
import { validateAppointmentForIdVeterinary } from '../../repositories/appointmentRepository/validateAppointmentForIdVeterinary.js'
import { verifyAppointmentDate } from '../../repositories/appointmentRepository/verifyAppointmentDate.js'
import { getAppointmentDateTimeByIdAppointment } from '../../repositories/appointmentRepository/getAppointmentDateTimeByIdAppointment.js'

async function veterinaryEditAppointmentController (req, res) {
  try {
    // Obtener id de la cita
    const idAppointment = req.params.idAppointment

    if (!idAppointment) {
      return res.status(400).json({ message: 'ID de cita no proporcionado.' })
    }

    // Obtener token del header y extraer el id del veterinario autenticado
    const idVeterinary = await getAuthIdUser(req)

    // Extraer los datos enviados por el cliente
    const { date, startTime, idPet, reason, state } = req.body

    // Validar los datos con Joi
    await appointmentSchema.validateAsync({ date, startTime, reason, state, idVeterinary, idPet })

    // Validar que la cita pertenezca al veterinario autenticado
    const validateAppointment = await validateAppointmentForIdVeterinary(idVeterinary, idAppointment)
    if (!validateAppointment) {
      return res.status(400).send({ message: 'Sin autorización.' })
    }

    // Procesar fecha y hora de inicio
    const [year, month, day] = date.split('-').map(Number)
    const [hour, minutes] = startTime.split(':').map(Number)

    // Crear objeto Date con los datos de la cita
    const appointmentDate = new Date(year, month - 1, day, hour, minutes)

    // Calcular hora de fin sumando 60 minutos
    const endTime = addMinutes(appointmentDate, 60)

    // Validar que no sea la misma hora que ya estaba registrada
    const oldDateTimeQuery = await getAppointmentDateTimeByIdAppointment(idAppointment)
    const oldAppointmentDate = new Date(
      oldDateTimeQuery.date.getFullYear(),
      oldDateTimeQuery.date.getMonth(),
      oldDateTimeQuery.date.getDate(),
      oldDateTimeQuery.startTime.split(':').map(Number)[0],
      oldDateTimeQuery.startTime.split(':').map(Number)[1]
    )

    if (isSameHour(appointmentDate, oldAppointmentDate)) {
      return res.status(400).json({ message: 'La fecha y hora deben ser diferentes al valor original.' })
    }

    // Verificar que el horario no esté ocupado
    const available = await verifyAppointmentDate(date, idVeterinary, endTime, startTime)

    if (!available) {
      return res.status(400).json({ message: 'Horario con el veterinario seleccionado no disponible.' })
    }

    // Ejecutar la actualización en la base de datos
    const queryResult = await editAppointmentForId(idAppointment, date, startTime, endTime, reason, idPet, idVeterinary)

    // Verificar si la actualización fue exitosa
    if (!queryResult) {
      return res.status(400).send({ message: 'No se pudo modificar la cita.' })
    }

    return res.send({ message: 'Cita editada correctamente.' })
  } catch (error) {
    // Manejo de errores y validaciones Joi
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(
      error.details?.[0]?.message
        ? { message: error.details[0].message }
        : { message: 'Error inesperado. ' }
    )
  }
}

export { veterinaryEditAppointmentController }
