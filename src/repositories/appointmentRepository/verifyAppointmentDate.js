import { createConnection } from '../../config/databaseConnection.js'

async function verifyAppointmentDate (date, idVeterinary, endTime, startTime) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idAppointment) AS count FROM Appointment
      WHERE date = ?
        AND idVeterinary = ?
        AND (startTime < ? AND endTime > ?);
    `

    const [rows] = await connection.execute(sql, [date, idVeterinary, endTime, startTime])
    const count = rows[0].count

    return count === 0
  } catch (error) {
    throw new Error('No se pudo verificar la disponibilidad de la cita.')
  } finally {
    if (connection) await connection.end()
  }
}

export { verifyAppointmentDate }
