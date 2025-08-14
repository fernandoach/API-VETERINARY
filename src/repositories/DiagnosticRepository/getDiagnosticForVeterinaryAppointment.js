import { createConnection } from '../../config/databaseConnection.js'

async function getDiagnosticForVeterinaryAppointment (idVeterinary, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT 
        Diagnostic.idDiagnostic,
        Diagnostic.date,
        Diagnostic.description,
        Diagnostic.reason,
        Diagnostic.treatment,
        Diagnostic.idAppointment
      FROM Diagnostic
      INNER JOIN Appointment ON Appointment.idAppointment = Diagnostic.idAppointment
      INNER JOIN User ON User.idUser = Appointment.idVeterinary
      WHERE Appointment.idAppointment = ? AND User.idUser = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment, idVeterinary])

    return rows[0]
  } catch (error) {
    console.error('Error al obtener diagnóstico:', error.message)
    throw new Error('No se pudo obtener el diagnóstico.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getDiagnosticForVeterinaryAppointment }
