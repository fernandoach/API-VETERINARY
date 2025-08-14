import { editAppointmentState } from '../../repositories/appointmentRepository/editAppointmentState.js'
import { validateAppointmentForIdVeterinary } from '../../repositories/appointmentRepository/validateAppointmentForIdVeterinary.js'
import { verifyAppointmentExistByIdAppointment } from '../../repositories/appointmentRepository/verifyAppointmentExistByIdAppointment.js'
import { verifyAppointmentIsCanceled } from '../../repositories/appointmentRepository/verifyAppointmentIsCanceled.js'
import { verifyAppointmentIsCompleted } from '../../repositories/appointmentRepository/verifyAppointmentIsCompleted.js'
import { deleteDiagnosticByIdAppointment } from '../../repositories/DiagnosticRepository/deleteDiagnosticByIdAppointment.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'

async function veterinaryDeleteDiagnosticController (req, res) {
  try {
    // Extraer id de la cita desde los parámetros de la solicitud
    const idAppointment = req.params.idAppointment

    // Validar idAppointment
    if (!idAppointment) {
      return res.status(400).send({ message: 'Id de cita inválido.' })
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
    const idVeterinary = await getAuthIdUser(req)

    const isOwner = await validateAppointmentForIdVeterinary(idVeterinary, idAppointment)
    if (!isOwner) {
      return res.status(404).send({ message: 'Sin autorización.' })
    }

    // Intentar eliminar el diagnóstico
    const deleteDiagnosticQueryResult = await deleteDiagnosticByIdAppointment(idAppointment)
    const stateisEdited = await editAppointmentState(idAppointment, 'P')

    if (stateisEdited) {
      return deleteDiagnosticQueryResult ? res.send({ message: 'Diagnóstico eliminado con éxito' }) : res.status(400).send({ message: 'No se pudo eliminar diagnóstico.' })
    } else {
      return res.status(400).send({ message: 'No se pudo eliminar diagnóstico.' })
    }

    // Respuesta exitosa
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

export { veterinaryDeleteDiagnosticController }
