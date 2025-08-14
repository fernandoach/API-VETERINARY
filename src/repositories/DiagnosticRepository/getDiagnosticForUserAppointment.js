import { createConnection } from '../../config/databaseConnection.js'

async function getDiagnosticForUserAppointment (idUser, idAppointment) {
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
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE User.idUser = ? AND Appointment.idAppointment = ?;
    `

    const [rows] = await connection.execute(sql, [idUser, idAppointment])

    return rows
  } catch (error) {
    console.error('Error al obtener diagnóstico:', error.message)
    throw new Error('No se pudo obtener el diagnóstico.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getDiagnosticForUserAppointment }
