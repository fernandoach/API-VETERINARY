import { createConnection } from '../../config/databaseConnection.js'

async function getUserRoleForId (idUser) {
  try {
    const sql = `
      SELECT role FROM User
      WHERE idUser = ?;
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    if (result.length === 0) {
      return -1
    }
    return result[0].role
  } catch (error) {
    return error
  }
}

export { getUserRoleForId }
