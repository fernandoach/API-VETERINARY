import { createConnection } from '../../config/databaseConnection.js'

async function getPetsForId (idUser) {
  try {
    const sql = `
      SELECT idPet, name, species, race, gender, weight, birthday FROM Pet
      WHERE idUser = ?
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    return result
  } catch (error) {
    return error
  }
}

export { getPetsForId }
