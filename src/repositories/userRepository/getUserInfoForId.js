import { createConnection } from '../../config/databaseConnection.js'

async function getUserInfoForId (idUser) {
  try {
    const sql = `
      SELECT firstname FROM User
      WHERE idUser = ?;
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    if (result.length === 0) {
      return -1
    }

    const userInfo = {
      idUser,
      firstname: result[0].firstname
      // TODO:
    }

    return result[0].role
  } catch (error) {
    return error
  }
}

export { getUserInfoForId }
