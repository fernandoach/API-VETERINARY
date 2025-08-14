import { createConnection } from '../../config/databaseConnection.js'

async function getUserRoleForId (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT role FROM User
      WHERE idUser = ?;
    `
    const [rows] = await connection.execute(sql, [idUser])

    if (rows.length === 0) {
      throw new Error('No se pudo obtener el rol del usuario')
    }

    return rows[0].role
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error.message)
    throw new Error('No se pudo obtener el rol del usuario')
  } finally {
    if (connection) await connection.release()
  }
}

export { getUserRoleForId }
