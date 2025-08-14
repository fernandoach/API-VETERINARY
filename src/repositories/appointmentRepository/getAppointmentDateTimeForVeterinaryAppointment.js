import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentDateTimeForVeterinaryAppointment (idVeterinary, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT date, startTime, endTime
      FROM Appointment
      WHERE idAppointment = ? AND idVeterinary = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment, idVeterinary])

    if (rows.length === 0) {
      throw new Error('No se pudo obtener la cita.')
    }

    return rows[0]
  } catch (error) {
    throw new Error('No se pudo obtener la cita.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getAppointmentDateTimeForVeterinaryAppointment }
