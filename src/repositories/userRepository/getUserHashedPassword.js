import { createConnection } from '../../config/databaseConnection.js'

async function getUserHashedPassword (idUser) {
  try {
    const sql = `
      SELECT password FROM User
      WHERE idUser = ?
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    if (result.length === 0) {
      return -1
    }
    return result[0].password
  } catch (error) {
    return error
  }
}

export { getUserHashedPassword }
