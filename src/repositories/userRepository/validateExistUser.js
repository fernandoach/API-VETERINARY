import { createConnection } from '../../config/databaseConnection.js'

async function validateExistUser (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idUser) AS count
      FROM User
      WHERE idUser = ?;
    `

    const [rows] = await connection.execute(sql, [idUser])

    return rows[0].count === 1
  } catch (error) {
    console.error('Error al validar existencia de usuario:', error.message)
    throw new Error('No se pudo validar la existencia del usuario.')
  } finally {
    if (connection) await connection.release()
  }
}

export { validateExistUser }
