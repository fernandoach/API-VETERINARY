import { createConnection } from '../../config/databaseConnection.js'

async function getIdUserForDni (dni) {
  try {
    const sql = `
      SELECT idUser FROM User
      WHERE dni = ?
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [dni])
    if (result.length === 0) {
      return -1
    }
    return result[0].idUser
  } catch (error) {
    return error
  }
}

export { getIdUserForDni }
