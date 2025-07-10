import { doesAppointmentBelongToIdUser } from '../../repositories/appointmentRepository/doesAppointmentBelongToIdUser.js'
import { getDiagnosticForUserAppointment } from '../../repositories/DiagnosticRepository/getDiagnosticForUserAppointment.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'
import { uuidSchema } from '../../validations/uuidSchema.js'

async function userViewDiagnosticController (req, res) {
  try {
    // Obtener ID del usuario a partir del request
    const idUser = await getAuthIdUser(req)

    const idAppointment = req.params.idAppointment

    await uuidSchema.validateAsync({ uuid: idAppointment })

    // Validar que se haya enviado el ID de la cita
    if (!idAppointment) {
      return res.status(400).json({ message: 'ID de la cita es requerido.' })
    }

    // Verificar si la cita le pertenece al usuario autenticado
    const isOwner = await doesAppointmentBelongToIdUser(idAppointment, idUser)
    if (!isOwner) {
      return res.status(403).json({ message: 'Sin autorización.' })
    }

    // Obtener el diagnóstico asociado a la cita
    const diagnostics = await getDiagnosticForUserAppointment(idUser, idAppointment)

    // Validar si existe un diagnóstico
    if (!Array.isArray(diagnostics)) {
      return res.status(404).json({ message: 'Sin autorización.' })
    }
    if (diagnostics.length === 0) {
      return res.status(404).json({ message: 'Aún no hay diagnostico para la cita.' })
    }

    // Retornar el primer diagnóstico encontrado
    return res.status(200).json(diagnostics[0])
  } catch (error) {
    console.error('Error al obtener diagnóstico:', error)

    const message = error?.message || 'Error inesperado al obtener el diagnóstico.'
    return res.status(400).json({ message })
  }
}

export { userViewDiagnosticController }
