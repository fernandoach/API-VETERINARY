import { createConnection } from '../../config/databaseConnection.js'

async function editUserPasswordForId (idUser, newPassword) {
  try {
    const sql = `
      UPDATE User
      SET password = ?
      WHERE idUser = ?;
    `

    const connection = await createConnection()
    const [result] = await connection.execute(sql, [newPassword, idUser])

    return result.affectedRows === 1
  } catch (error) {
    return error
  }
}

export { editUserPasswordForId }
