import { createConnection } from '../../config/databaseConnection.js'

async function editAppointmentForId (idAppointment, date, startTime, endTime, reason, idPet, idVeterinary) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      UPDATE Appointment
      SET date = ?, startTime = ?, endTime = ?, idPet = ?, reason = ?
      WHERE idAppointment = ? AND idVeterinary = ?;
    `

    const [result] = await connection.execute(sql, [
      date, startTime, endTime, idPet, reason, idAppointment, idVeterinary
    ])

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
    if (connection) await connection.release()
  }
}

export { editAppointmentForId }
