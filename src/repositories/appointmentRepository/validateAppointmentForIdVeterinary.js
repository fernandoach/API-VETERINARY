import { createConnection } from '../../config/databaseConnection.js'

async function validateAppointmentForIdVeterinary (idVeterinary, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idAppointment) AS count
      FROM Appointment
      WHERE idAppointment = ? AND idVeterinary = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment, idVeterinary])

    return rows[0].count === 1
  } catch (error) {
    console.error('Error al validar cita del veterinario:', error.message)
    throw new Error('No se pudo validar la cita del veterinario.')
  } finally {
    if (connection) await connection.end()
  }
}

export { validateAppointmentForIdVeterinary }
