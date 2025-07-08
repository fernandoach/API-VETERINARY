import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { validateAppointmentForIdVeterinary } from '../appointmentRepository/validateAppointmentForIdVeterinary.js'
import { verifyAppointmentExistByIdAppointment } from '../appointmentRepository/verifyAppointmentExistByIdAppointment.js'
import { verifyAppointmentIsCanceled } from '../appointmentRepository/verifyAppointmentIsCanceled.js'
import { verifyAppointmentIsCompleted } from '../appointmentRepository/verifyAppointmentIsCompleted.js'
import { getDiagnosticForVeterinaryAppointment } from './getDiagnosticForVeterinaryAppointment.js'

async function veterinaryViewDiagnosticController (req, res) {
  try {
    // Extraer los datos de cita de los parametros
    const idAppointment = req.params.idAppointment

    // Validar idAppointment vacio
    if (!idAppointment) {
      return res.status(400).send({ message: 'Debe espescificar la cita a la pertenece el diagnóstico.' })
    }

    // Validar cita existente
    const appointmentExist = await verifyAppointmentExistByIdAppointment(idAppointment)
    if (!appointmentExist) {
      return res.status(400).send({ message: 'Sin autorización.' })
    }

    // Validar cita cancelada
    const isCanceled = await verifyAppointmentIsCanceled(idAppointment)
    if (!isCanceled) {
      return res.status(400).send({ message: 'No hay diagnóstico de una cita cancelada.' })
    }

    // Validar si la cita ya tiene diagnóstico
    const isCompleted = await verifyAppointmentIsCompleted(idAppointment)
    if (!isCompleted) {
      return res.status(400).send({ message: 'Aún no se registro un diagnóstico para esta cita.' })
    }

    // Validar que el veterinario este asignado a la cita
    const authorization = req.header('Authorization')
    const idVeterinary = await getAuthIdUser(authorization)

    const isOwner = await validateAppointmentForIdVeterinary(idVeterinary, idAppointment)
    if (!isOwner) {
      return res.status(404).send({ message: 'Sin autorización.' })
    }

    // Intentar mostrar el diagnóstico
    const getDiagnosticQueryResult = await getDiagnosticForVeterinaryAppointment(idVeterinary, idAppointment)

    // Respuesta exitosa
    return res.send({ ...getDiagnosticQueryResult })
  } catch (error) {
    // Manejo de errores de validación o del servidor
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

export { veterinaryViewDiagnosticController }
