import { createConnection } from '../../config/databaseConnection.js'

async function editDiagnosticForIdAppointment (date, description, reason, treatment, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      UPDATE Diagnostic
      SET date = ?, description = ?, reason = ?, treatment = ?
      WHERE idAppointment = ?;
    `

    const [result] = await connection.execute(sql, [
      date, description, reason, treatment, idAppointment
    ])

    if (result.affectedRows === 0) {
      throw new Error('No se encontró el diagnóstico o no tienes permiso para editarlo.')
    }

    return true
  } catch (error) {
    console.error('Error al editar el diagnóstico:', error.message)

    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "Diagnostic" no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Diagnóstico no existentes.')
      default:
        throw new Error('No se pudo editar el diagnóstico.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { editDiagnosticForIdAppointment }
