import { createConnection } from '../../config/databaseConnection.js'

async function deletePetForIdPet (idPet) {
  let connection

  try {
    connection = await createConnection()
    // FIX: Eliminar con todo y los registros asociados a este id de otras tablas
    const sql = `
      DELETE FROM Pet
      WHERE idPet = ?;
    `
    const [result] = await connection.execute(sql, [idPet])
    if (result.affectedRows === 0) {
      throw new Error('No se pudo eliminar la mascota. Verifique que exista.')
    }
    return true
  } catch (error) {
    throw new Error('Error al eliminar la mascota: ' + error.message)
  }
}

export { deletePetForIdPet }
