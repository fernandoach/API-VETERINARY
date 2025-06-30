import { createConnection } from '../../config/databaseConnection.js'

async function validatePetForIds (idPet, idUser) {
  try {
    const sql = `
      SELECT COUNT(idPet) as count FROM Pet
      WHERE idUser = ? AND idPet = ?;`

    const connection = await createConnection()
    const [rows] = await connection.execute(sql, [idUser, idPet])
    const count = rows[0].count
    if (count > 0) {
      return false
    }
    return true
  } catch (error) {
    return error
  }
}

export { validatePetForIds }
