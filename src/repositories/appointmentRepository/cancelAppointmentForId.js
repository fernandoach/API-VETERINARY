import { createConnection } from '../../config/databaseConnection.js'

async function cancelAppointmentForId (idAppointment) {
  try {
    const sql = `
      UPDATE Appointment
      SET state = "X"
      WHERE idAppointment = ? AND state <> "X";
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idAppointment])
    return result.affectedRows
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

export { cancelAppointmentForId }
