import { createConnection } from '../../config/databaseConnection.js'

async function verifySchedule (date, idVeterinary, endTime, startTime) {
  try {
    const sql = `SELECT COUNT(idAppointment) AS count FROM Appointment
      WHERE date = ?
      AND idVeterinary = ?
      AND (startTime < ? AND endTime > ?)`

    const connection = await createConnection()
    const [rows] = await connection.execute(sql, [date, idVeterinary, endTime, startTime])
    const count = rows[0].count

    console.log(count)

    if (count > 0) {
      return false
    }
    return true
  } catch (error) {
    return error
  }
}

export { verifySchedule }
