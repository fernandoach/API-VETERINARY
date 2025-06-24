import { createConnection } from '../../config/databaseConnection.js'

async function getUserInfoForId (idUser) {
  try {
    const sql = `
      SELECT idUser, firstname, lastname, email, gender, birthday, telephone, role  FROM User
      WHERE idUser = ?;
    `

    const connection = await createConnection()
    const [result] = await connection.query(sql, [idUser])
    if (result.length === 0) {
      return -1
    }

    const userInfo = {
      idUser: result[0].idUser,
      firstname: result[0].firstname,
      lastname: result[0].lastname,
      gender: result[0].gender,
      birthday: result[0].birthday,
      telephone: result[0].telephone,
      role: result[0].role
    }

    return userInfo
  } catch (error) {
    return error
  }
}

export { getUserInfoForId }
