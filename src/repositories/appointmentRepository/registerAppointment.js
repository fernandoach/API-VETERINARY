import { createConnection } from '../../config/databaseConnection.js'

async function registerAppointment (date, startTime, endTime, reason, idVeterinary, idPet) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      INSERT INTO Appointment (
        idAppointment,
        date,
        startTime,
        endTime,
        reason,
        idVeterinary,
        idPet
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?);
    `

    const [result] = await connection.execute(sql, [
      date,
      startTime,
      endTime,
      reason,
      idVeterinary,
      idPet
    ])

    return result
  } catch (error) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        throw new Error('Ya existe un registro duplicado (cita con ID repetido).')
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "Appointment" no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('El veterinario o la mascota no existen (clave foránea inválida).')
      default:
        throw new Error('No se pudo registrar la cita.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { registerAppointment }
