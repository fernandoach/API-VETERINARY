import { createConnection } from '../../config/databaseConnection.js'

async function editUserPasswordForId (idUser, newPassword) {
  if (!idUser || !newPassword) {
    throw new Error('ID de usuario y nueva contraseña son requeridos')
  }

  const sql = `
    UPDATE User
    SET password = ?
    WHERE idUser = ?;
  `

  let connection

  try {
    connection = await createConnection()
    const [result] = await connection.execute(sql, [newPassword, idUser])

    return result.affectedRows === 1
  } catch (error) {
    throw new Error('No se pudo actualizar la contraseña')
  } finally {
    if (connection) await connection.release()
  }
}

export { editUserPasswordForId }
