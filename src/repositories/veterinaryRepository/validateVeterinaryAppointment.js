import { createConnection } from '../../config/databaseConnection.js'

async function validateVeterinaryAppointment (idVeterinary, idAppointment) {
  try {
    const sql = `
      SELECT COUNT(idAppointment) AS count FROM Appointment
      WHERE idAppointment = ? AND idVeterinary = ? ;
    `

    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idAppointment, idVeterinary])

    return result[0].count === 1
  } catch (error) {
    return error
  }
}

export { validateVeterinaryAppointment }
