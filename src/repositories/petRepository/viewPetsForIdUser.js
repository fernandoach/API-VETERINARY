import { createConnection } from '../../config/databaseConnection.js'

async function viewPetsForIdUser (idUser) {
  try {
    const sql = `
      SELECT idPet, name, species, race, gender, weight, birthday, idUser
      FROM Pet
      WHERE idUser = ? ;
    `
    const connection = await createConnection()
    const [result] = await connection.execute(sql, [idUser])
    return result
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('El correo o DNI proporcionado ya está registrado.')
    }
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('La tabla no existe en la base de datos.')
    }
    if (error.code.includes('ER_NO_REFERENCED_ROW')) {
      throw new Error('Mascota o veterinario no existentes.')
    }
    throw new Error(error)
  }
}

export { viewPetsForIdUser }
