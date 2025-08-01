import { createConnection } from '../../config/databaseConnection.js'

async function verifyPetExistByIdPet (idPet) {
  let connection

  try {
    connection = await createConnection()

    const sql = `
      SELECT COUNT(idPet) AS count FROM Pet
      WHERE idPet = ?;
    `
    const [rows] = await connection.execute(sql, [idPet])

    return rows[0].count > 0
  } catch (error) {
    throw new Error('La mascota no existe')
  } finally {
    if (connection) await connection.end()
  }
}

export { verifyPetExistByIdPet }
