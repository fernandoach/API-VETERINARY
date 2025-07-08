import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentsForIdUser (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT 
        Appointment.idAppointment, 
        Appointment.date, 
        Appointment.startTime, 
        Appointment.endTime, 
        Appointment.reason, 
        Appointment.state, 
        Appointment.idVeterinary, 
        Appointment.idPet 
      FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE User.idUser = ? AND Appointment.state <> 'X';
    `

    const [rows] = await connection.execute(sql, [idUser])
    return rows
  } catch (error) {
    throw new Error('No se pudieron obtener las citas del usuario.')
  } finally {
    if (connection) await connection.end()
  }
}

export { getAppointmentsForIdUser }
