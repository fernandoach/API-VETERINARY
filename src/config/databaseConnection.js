import mysql from 'mysql2/promise'

const databaseInfo = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: 'VETERINARY'
}

async function createConnection () {
  try {
    const connection = await mysql.createConnection(databaseInfo)
    return connection
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('La base de datos no responde.')
    }
    throw error
  }
}

export { createConnection }
