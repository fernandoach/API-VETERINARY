import { createConnection } from '../../config/databaseConnection.js'

async function getVeterinarians () {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT firstname, lastname, gender, birthday, email
      FROM User
      WHERE role = 'V';
    `

    const [rows] = await connection.execute(sql)
    return rows
  } catch (error) {
    console.error('Error al obtener los veterinarios:', error.message)
    throw new Error('No se pudo obtener la lista de veterinarios.')
  } finally {
    if (connection) await connection.end()
  }
}

export { getVeterinarians }
