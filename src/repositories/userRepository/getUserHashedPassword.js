import { createConnection } from '../../config/databaseConnection.js'

async function getUserHashedPassword (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT password FROM User
      WHERE idUser = ?;
    `
    const [rows] = await connection.execute(sql, [idUser])

    if (rows.length === 0) {
      throw new Error('Usuario y/o contraseña invalidos.')
    }

    return rows[0].password
  } catch (error) {
    throw new Error('Usuario y/o contraseña invalidos.')
  } finally {
    if (connection) await connection.release()
  }
}

export { getUserHashedPassword }
