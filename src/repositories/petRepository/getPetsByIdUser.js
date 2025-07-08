import { createConnection } from '../../config/databaseConnection.js'

async function getPetsByIdUser (idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT idPet, name, species, race, gender, weight, birthday, idUser
      FROM Pet
      WHERE idUser = ?;
    `

    const [rows] = await connection.execute(sql, [idUser])
    return rows
  } catch (error) {
    console.error('Error al obtener mascotas del usuario:', error.message)
    throw new Error('No se pudieron obtener las mascotas del usuario.')
  } finally {
    if (connection) await connection.end()
  }
}

export { getPetsByIdUser }
