import { createConnection } from '../../config/databaseConnection.js'

async function getIdUserForEmail (email) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT idUser FROM User
      WHERE email = ?;
    `
    const [rows] = await connection.execute(sql, [email])

    if (rows.length === 0) {
      throw new Error('Usuario y/o contraseña invalidos')
    }

    return rows[0].idUser
  } catch (error) {
    throw new Error('Usuario y/o contraseña invalidos')
  } finally {
    if (connection) await connection.end()
  }
}

export { getIdUserForEmail }
