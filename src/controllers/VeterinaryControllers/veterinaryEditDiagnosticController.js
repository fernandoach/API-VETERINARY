import { validateAppointmentForIdVeterinary } from '../../repositories/appointmentRepository/validateAppointmentForIdVeterinary.js'
import { verifyAppointmentExistByIdAppointment } from '../../repositories/appointmentRepository/verifyAppointmentExistByIdAppointment.js'
import { verifyAppointmentIsCanceled } from '../../repositories/appointmentRepository/verifyAppointmentIsCanceled.js'
import { verifyAppointmentIsCompleted } from '../../repositories/appointmentRepository/verifyAppointmentIsCompleted.js'
import { editDiagnosticForIdAppointment } from '../../repositories/DiagnosticRepository/editDiagnosticByIdAppointment.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { diagnosticSchema } from '../../validations/diagnosticSchema.js'

async function veterinaryEditDiagnosticController (req, res) {
  try {
    // Extraer los datos del diagnostico del cuerpo de la solicitud
    const { description, reason, treatment } = req.body
    const now = new Date(Date.now())
    const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, 0)}-${now.getDay().toString().padStart(2, 0)}`

    // Validar datos del diagnostico usando Joi
    await diagnosticSchema.validateAsync({ date, description, reason, treatment })

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
      return res.status(400).send({ message: 'No puede editar un diagnóstico en una cita cancelada.' })
    }

    // Validar si la cita ya tiene diagnóstico
    const isCompleted = await verifyAppointmentIsCompleted(idAppointment)
    if (!isCompleted) {
      return res.status(400).send({ message: 'No puede editar un diagnóstico inexistente.' })
    }

    // Validar que el veterinario este asignado a la cita
    const idVeterinary = await getAuthIdUser(req)

    const isOwner = await validateAppointmentForIdVeterinary(idVeterinary, idAppointment)
    if (!isOwner) {
      return res.status(404).send({ message: 'Sin autorización.' })
    }

    // TODO: Validar si son los mismo valores que se desean editar ?

    // Intentar editar el diagnóstico
    const registerDiagnosticQueryResult = await editDiagnosticForIdAppointment(date, description, reason, treatment, idAppointment)

    // Verificar si la actualización se realizó correctamente
    if (!registerDiagnosticQueryResult) {
      return res.status(400).send({ message: 'No se pudo editar el diagnóstico.' })
    }

    // Respuesta exitosa
    return res.send({ message: 'Diagnóstico editado con éxito.' })
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

export { veterinaryEditDiagnosticController }
