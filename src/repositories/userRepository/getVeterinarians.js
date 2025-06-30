import { createConnection } from '../../config/databaseConnection.js'

async function getVeterinarians () {
  try {
    const sql = `
      SELECT firstname, lastname, gender, birthday, email FROM User
      WHERE role = 'V'
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql)
    return result
  } catch (error) {
    return error
  }
}

export { getVeterinarians }
