import { createConnection } from '../../config/databaseConnection.js'

async function editAppointmentState (idAppointment, state) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      UPDATE Appointment
      SET state = ?
      WHERE idAppointment = ?;
    `

    const [result] = await connection.execute(sql, [state, idAppointment])

    if (result.affectedRows === 0) {
      throw new Error('No se encontró la cita o no tienes permiso para editarla.')
    }

    return true
  } catch (error) {
    console.error('Error al editar la cita:', error.message)

    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "Appointment" no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('Mascota o veterinario no existentes.')
      default:
        throw new Error('No se pudo editar la cita.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { editAppointmentState }
