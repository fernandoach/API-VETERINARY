import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentsByIdVeterinary (idVeterinary, startDate, endDate) {
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
        Pet.name, 
        Pet.species, 
        Pet.race, 
        Appointment.state
      FROM Appointment
      INNER JOIN Pet ON Pet.idPet = Appointment.idPet
      INNER JOIN User ON User.idUser = Pet.idUser
      WHERE 
        Appointment.idVeterinary = ? 
        AND Appointment.state <> 'X' 
        AND Appointment.date >= ? 
        AND Appointment.date < ?
      ORDER BY 
        Appointment.date ASC, 
        Appointment.startTime ASC;
    `

    const [rows] = await connection.execute(sql, [idVeterinary, startDate, endDate])

    if (rows.length === 0) {
      return []
    }
    return rows
  } catch (error) {
    console.log(error)
    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Veterinario no existente.')
      default:
        throw new Error('Sin autorización.')
    }
  } finally {
    if (connection) await connection.release()
  }
}

export { getAppointmentsByIdVeterinary }
