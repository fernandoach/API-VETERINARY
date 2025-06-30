import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentDateTimeForIds (idAppointment, idUser) {
  try {
    const sql = `
      SELECT Appointment.date, Appointment.startTime, Appointment.endTime
      FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE Appointment.idAppointment = ? AND User.idUser = ? ;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idAppointment, idUser])
    return result[0]
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla no existe en la base de datos.')
    }
    if (error.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error('Mascota o veterinario no existentes.')
    }
    throw new Error(error)
  }
}

export { getAppointmentDateTimeForIds }
