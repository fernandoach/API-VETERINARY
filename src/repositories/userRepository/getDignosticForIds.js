import { createConnection } from '../../config/databaseConnection.js'

async function getDiagnosticForIds (idUser, idAppointment) {
  try {
    const sql = `
      SELECT Diagnostic.idDiagnostic, Diagnostic.date, Diagnostic.description, Diagnostic.reason, Diagnostic.treatment, Diagnostic.idAppointment FROM Diagnostic
      INNER JOIN Appointment ON Appointment.idAppointment = Diagnostic.idAppointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE User.idUser = ? AND Appointment.idAppointment = ?;
    `
    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser, idAppointment])
    return result
  } catch (error) {
    return error
  }
}

export { getDiagnosticForIds }
