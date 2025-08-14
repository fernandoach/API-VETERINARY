import { createConnection } from '../../config/databaseConnection.js'

async function registerPet (name, species, race, gender, weight, birthday, idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      INSERT INTO Pet (
        idPet, name, species, race, gender, weight, birthday, idUser
      ) VALUES (
        UUID(), ?, ?, ?, ?, ?, ?, ?
      );
    `

    const [result] = await connection.execute(sql, [
      name, species, race, gender, weight, birthday, idUser
    ])
    if (result.affectedRows === 1) {
      return true
    }

    return false
  } catch (error) {
    console.error('Error al registrar mascota:', error.message)

    switch (error.code) {
      case 'ER_NO_SUCH_TABLE':
        throw new Error('La tabla "Pet" no existe en la base de datos.')
      case 'ER_NO_REFERENCED_ROW_2':
        throw new Error('El usuario al que intenta asociar la mascota no existe.')
      default:
        throw new Error('No se pudo registrar la mascota.')
    }
  } finally {
    if (connection) await connection.release()
  }
}

export { registerPet }
