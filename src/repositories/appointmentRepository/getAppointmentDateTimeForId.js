import { createConnection } from '../../config/databaseConnection.js'

async function getAppointmentDateTimeForId (idAppointment) {
  try {
    const sql = `
      SELECT date, startTime, endTime
      FROM Appointment
      WHERE idAppointment = ? ;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idAppointment])
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

export { getAppointmentDateTimeForId }
