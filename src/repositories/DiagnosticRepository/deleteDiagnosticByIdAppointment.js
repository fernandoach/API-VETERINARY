import { createConnection } from '../../config/databaseConnection.js'

async function deleteDiagnosticByIdAppointment (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      DELETE FROM Diagnostic
      WHERE idAppointment = ?;
    `

    const [result] = await connection.execute(sql, [idAppointment])
    if (result.affectedRows === 1) {
      return true
    }

    return false
  } catch (error) {
    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla Appointment no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Referencia inválida: mascota o veterinario no existen.')
      default:
        throw new Error('No se pudo cancelar la cita.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { deleteDiagnosticByIdAppointment }
