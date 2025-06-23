import bcrypt from 'bcrypt'

async function hashPassword (password) {
  const hashedPassword = await bcrypt.hash(password, 12)
  return hashedPassword
}

export { hashPassword }
