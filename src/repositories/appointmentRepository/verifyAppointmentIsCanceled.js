import { createConnection } from '../../config/databaseConnection.js'

async function verifyAppointmentIsCanceled (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idAppointment) AS count FROM Appointment
      WHERE idAppointment = ? AND state <> 'X';
    `

    const [rows] = await connection.execute(sql, [idAppointment])
    const count = rows[0].count

    return count === 1
  } catch (error) {
    throw new Error('No se pudo verificar la disponibilidad de la cita.')
  } finally {
    if (connection) await connection.end()
  }
}

export { verifyAppointmentIsCanceled }
