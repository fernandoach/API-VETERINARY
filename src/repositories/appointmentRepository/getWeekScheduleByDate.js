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
      WHERE date BETWEEN ? AND ? AND state IN ('P', 'C') AND idVeterinary = ?
      ORDER BY date ASC, startTime ASC;
    `

    const [rows] = await connection.execute(sql, [startDate, endDate, idVeterinary])

    const formattedRows = rows.map(row => ({
      ...row,
      date: row.date.toISOString().split('T')[0]
    }))

    return formattedRows
  } catch (error) {
    throw new Error('No se pudo obtener el horario semanal.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getWeekScheduleByDate }
