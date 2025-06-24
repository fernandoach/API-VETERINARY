import { createConnection } from '../../config/databaseConnection.js'

async function registerUser (firstname, lastname, gender, birthday, dni, telephone, email, password) {
  try {
    const sql = `
      INSERT INTO User(
        idUser, firstname, lastname, gender, birthday, dni, telephone, email, password
      ) VALUES (
        UUID(), ?, ?, ?, ?, ?, ?, ?, ?
      );
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [
      firstname, lastname, gender, birthday, dni, telephone, email, password
    ])
    console.log(result)

    return result
  } catch (error) {
    return error
  }
}

export { registerUser }
