import { createConnection } from '../../config/databaseConnection.js'

async function validateExistUser (idUser) {
  try {
    const sql = `
      SELECT COUNT(idUser) AS count FROM User
      WHERE idUser = ? ;
    `

    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idUser])

    return result[0].count === 1
  } catch (error) {
    return error
  }
}

export { validateExistUser }
