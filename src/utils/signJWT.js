import jsonwebtoken from 'jsonwebtoken'

function signJWT (idUser) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'tusecreto'
    console.log(secretKey, idUser)
    const jwt = jsonwebtoken.sign({ data: idUser }, secretKey, { algorithm: 'HS256', expiresIn: '2h' })
    return jwt
  } catch (error) {
    throw new Error('Error al generar token de inicio. ')
  }
}

export { signJWT }
