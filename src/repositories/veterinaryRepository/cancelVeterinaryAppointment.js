import { createConnection } from '../../config/databaseConnection.js'

async function cancelVeterinaryAppointment (idAppointment) {
  try {
    const sql = `
      UPDATE Appointment
      SET state = 'X'
      WHERE idAppointment = ? AND state = 'P';`

    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idAppointment])

    return result.affectedRows === 1
  } catch (error) {
    return error
  }
}

export { cancelVeterinaryAppointment }
