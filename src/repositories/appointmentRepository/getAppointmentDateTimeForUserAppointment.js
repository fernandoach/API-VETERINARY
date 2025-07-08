import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentDateTimeForUserAppointment (idUser, idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT Appointment.date, Appointment.startTime, Appointment.endTime
      FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE Appointment.idAppointment = ? AND User.idUser = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment, idUser])

    if (rows.length === 0) {
      throw new Error('No se pudo obtener la cita.')
    }

    return rows[0]
  } catch (error) {
    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Mascota o veterinario no existentes.')
      default:
        throw new Error('Sin autorización.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { getAppointmentDateTimeForUserAppointment }
