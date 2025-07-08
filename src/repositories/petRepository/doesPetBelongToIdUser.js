import { createConnection } from '../../config/databaseConnection.js'

async function doesPetBelongToIdUser (idPet, idUser) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idPet) AS count FROM Pet
      WHERE idUser = ? AND idPet = ?;
    `
    const [rows] = await connection.execute(sql, [idUser, idPet])

    return rows[0].count > 0
  } catch (error) {
    throw new Error('Mascota o veterinario no existentes')
  } finally {
    if (connection) await connection.end()
  }
}

export { doesPetBelongToIdUser }
