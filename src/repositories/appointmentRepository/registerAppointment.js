import { createConnection } from '../../config/databaseConnection.js'

async function registerAppointment (date, startTime, endTime, reason, idVeterinary, idPet) {
  try {
    const sql = `
      INSERT INTO Appointment (
        idAppointment,
        date,
        startTime,
        endTime,
        reason,
        idVeterinary,
        idPet
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?) ;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [date, startTime, endTime, reason, idVeterinary, idPet])
    return result
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El correo o DNI proporcionado ya está registrado.')
    }
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla no existe en la base de datos.')
    }
    if (error.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error('Mascota o veterinario no existentes.')
    }
    throw new Error(error)
  }
}

export { registerAppointment }
