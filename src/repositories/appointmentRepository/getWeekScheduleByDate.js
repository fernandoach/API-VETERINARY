import { createConnection } from '../../config/databaseConnection.js'

async function getWeekScheduleByDate (startDate, endDate, idVeterinary) {
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT date, startTime, endTime
      FROM Appointment
      WHERE date BETWEEN ? AND ? AND state = 'P' AND idVeterinary = ?
      ORDER BY startTime ASC;
    `

    const [rows] = await connection.execute(sql, [startDate, endDate, idVeterinary])
    return rows
  } catch (error) {
    throw new Error('No se pudo obtener el horario semanal.')
  } finally {
    if (connection) await connection.end()
  }
}

export { getWeekScheduleByDate }
