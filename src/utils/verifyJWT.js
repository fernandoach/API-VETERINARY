import jwt from 'jsonwebtoken'

function verifyJWT (token) {
  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'tusecreto'
    const verify = jwt.verify(token, secretKey)
    return verify
  } catch (error) {
    throw new Error('Error al verificar token.')
  }
}

export { verifyJWT }
