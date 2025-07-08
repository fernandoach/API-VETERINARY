import { createConnection } from '../../config/databaseConnection.js'

async function verifyAppointmentIsCompleted (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idAppointment) AS count FROM Appointment
      WHERE idAppointment = ? AND state = 'C';
    `

    const [rows] = await connection.execute(sql, [idAppointment])
    const count = rows[0].count

    return count === 1
  } catch (error) {
    throw new Error('No se pudo verificar el estado de la cita.')
  } finally {
    if (connection) await connection.end()
  }
}

export { verifyAppointmentIsCompleted }
