import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentsForUserId (idUser) {
  try {
    const sql = `
      SELECT Appointment.idAppointment, Appointment.date, Appointment.startTime, Appointment.endTime, Appointment.reason, Appointment.state, Appointment.idVeterinary, Appointment.idPet FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE User.idUser = ? ;
    `
    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    return result
  } catch (error) {
    return error
  }
}

export { getAppointmentsForUserId }
