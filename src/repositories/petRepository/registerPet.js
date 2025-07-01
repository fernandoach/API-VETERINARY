import { createConnection } from '../../config/databaseConnection.js'

async function registerPet (name, species, race, gender, weight, birthday, idUser) {
  try {
    const sql = `
      INSERT INTO Pet (idPet, name, species, race, gender, weight, birthday, idUser) 
      VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?);`
    const connection = await createConnection()
    const [result] = await connection.query(sql, [name, species, race, gender, weight, birthday, idUser])
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

export { registerPet }
