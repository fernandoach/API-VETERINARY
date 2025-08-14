import { createConnection } from '../../config/databaseConnection.js'

async function doesAppointmentBelongToIdUser (idAppointment, idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(Appointment.idAppointment) AS count FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE Appointment.idAppointment = ?
        AND User.idUser = ?
    `

    const [rows] = await connection.execute(sql, [idAppointment, idUser])
    const count = rows[0].count

    return count === 1
  } catch (error) {
    throw new Error('No se pudo verificar la disponibilidad de la cita.')
  } finally {
    if (connection) await connection.release()
  }
}

export { doesAppointmentBelongToIdUser }
