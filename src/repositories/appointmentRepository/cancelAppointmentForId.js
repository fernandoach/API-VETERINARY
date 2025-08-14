import { createConnection } from '../../config/databaseConnection.js'

async function cancelAppointmentForId (idAppointment) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      UPDATE Appointment
      SET state = "X"
      WHERE idAppointment = ? AND state <> "X" AND state <> "C";
    `

    const [result] = await connection.execute(sql, [idAppointment])

    if (result.affectedRows === 0) {
      return false
    }

    return true
  } catch (error) {
    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla Appointment no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Referencia inválida: mascota o veterinario no existen.')
      default:
        throw new Error('No se pudo cancelar la cita.')
    }
  } finally {
    if (connection) await connection.release()
  }
}

export { cancelAppointmentForId }
