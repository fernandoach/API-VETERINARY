import { createConnection } from '../../config/databaseConnection.js'

async function getUserInfoForId (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT 
        idUser, firstname, lastname, email, gender, birthday, telephone, role  
      FROM User
      WHERE idUser = ?;
    `
    const [rows] = await connection.execute(sql, [idUser])

    if (rows.length === 0) {
      throw new Error('No se pudo obtener la información del usuario')
    }

    return rows[0]
  } catch (error) {
    throw new Error('No se pudo obtener la información del usuario')
  } finally {
    if (connection) await connection.end()
  }
}

export { getUserInfoForId }
