import { createConnection } from '../../config/databaseConnection.js'

async function getIdUserForEmail (email) {
  try {
    const sql = `
      SELECT idUser FROM User
      WHERE email = ?
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [email])
    console.log(result)
    if (result.length === 0) {
      return -1
    }
    return result[0].idUser
  } catch (error) {
    return error
  }
}

export { getIdUserForEmail }
