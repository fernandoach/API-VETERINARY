import { createConnection } from '../../config/databaseConnection.js'

async function getDiagnosticByIdAppointment (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT 
        idDiagnostic,
        date,
        description,
        reason,
        treatment,
        idAppointment
      FROM Diagnostic
      WHERE idAppointment = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment])

    return rows
  } catch (error) {
    console.error('Error al obtener diagnóstico:', error.message)
    throw new Error('No se pudo obtener el diagnóstico.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getDiagnosticByIdAppointment }
