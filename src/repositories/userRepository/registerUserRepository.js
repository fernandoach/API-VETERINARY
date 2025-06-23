import { createConnection } from '../../config/databaseConnection.js'

async function registerUserRepository (firstname, lastname, gender, birthday, dni, telephone, email, password) {
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

    return result
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El correo o DNI proporcionado ya está registrado.')
    }
    throw error
  }
}

export { registerUserRepository }
