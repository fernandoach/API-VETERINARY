import { createConnection } from '../../config/databaseConnection.js'

async function editPetForIdPet (idPet, name, species, race, gender, weight, birthday, idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      UPDATE Pet
      SET name = ?, species = ?, race = ?, gender = ?, weight = ?, birthday = ?, idUser = ?
      WHERE idPet = ?;
    `

    const [result] = await connection.execute(sql, [
      name, species, race, gender, weight, birthday, idUser, idPet
    ])

    return result.affectedRows === 1
  } catch (error) {
    console.error('Error al editar la mascota:', error.message)

    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla no existe en la base de datos.')
    }

    if (error.code?.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error('El usuario especificado no existe.')
    }

    throw new Error('No se pudo editar la mascota.')
  } finally {
    if (connection) await connection.end()
  }
}

export { editPetForIdPet }
