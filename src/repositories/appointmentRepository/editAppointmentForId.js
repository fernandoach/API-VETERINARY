import { createConnection } from '../../config/databaseConnection.js'

async function editAppointmentForId (idAppointment, date, startTime, endTime, reason, idPet, idVeterinary) {
  try {
    const sql = `
      UPDATE Appointment
      SET date = ?, startTime = ?, endTime = ?, idPet = ?, reason = ?
      WHERE idAppointment = ? AND idVeterinary = ?;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [date, startTime, endTime, idPet, reason, idAppointment, idVeterinary])
    return result.affectedRows === 1
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

export { editAppointmentForId }
