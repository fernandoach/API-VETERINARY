import { createConnection } from '../../config/databaseConnection.js'

async function editPetForIdPet (idPet, name, species, race, gender, weight, birthday, idUser) {
  try {
    const sql = `
      UPDATE Pet
      SET name = ?, species = ?, race = ?, gender = ?, weight = ?, birthday = ?, idUser = ?
      WHERE idPet = ?;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [name, species, race, gender, weight, birthday, idUser, idPet])
    return result.affectedRows === 1
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla no existe en la base de datos.')
    }
    if (error.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error('Mascota o veterinario no existentes.')
    }
    throw new Error(error)
  }
}

export { editPetForIdPet }
