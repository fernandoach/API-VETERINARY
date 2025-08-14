import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentDateTimeByIdAppointment (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT 
        date, startTime, endtime
      FROM Appointment
      WHERE idAppointment = ?;
    `

    const [rows] = await connection.execute(sql, [idAppointment])
    return rows[0]
  } catch (error) {
    console.log(error)
    throw new Error('No se pudo obtener la hora de inicio de la cita.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getAppointmentDateTimeByIdAppointment }
