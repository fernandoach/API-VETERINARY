import { createConnection } from '../../config/databaseConnection.js'

async function getIdUserForDni (dni) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT idUser
      FROM User
      WHERE dni = ?;
    `

    const [rows] = await connection.execute(sql, [dni])

    return rows.length > 0 ? rows[0].idUser : -1
  } catch (error) {
    throw new Error('No se pudo obtener el usuario por DNI.')
  } finally {
    if (connection) await connection.end()
  }
}

export { getIdUserForDni }
