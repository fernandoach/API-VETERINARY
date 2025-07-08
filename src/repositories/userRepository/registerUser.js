import { createConnection } from '../../config/databaseConnection.js'

async function registerUser (firstname, lastname, gender, birthday, dni, telephone, email, password) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      INSERT INTO User (
        idUser, firstname, lastname, gender, birthday, dni, telephone, email, password
      ) VALUES (
        UUID(), ?, ?, ?, ?, ?, ?, ?, ?
      );
    `

    const [result] = await connection.execute(sql, [
      firstname, lastname, gender, birthday, dni, telephone, email, password
    ])

    return result
  } catch (error) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        throw new Error('El correo electrónico o DNI ya están registrados.')
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "User" no existe en la base de datos.')
      default:
        throw new Error('No se pudo registrar el usuario.')
    }
  } finally {
    if (connection) await connection.end()
  }
}

export { registerUser }
