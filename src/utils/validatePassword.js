import bcrypt from 'bcrypt'

async function validatePassword (userPassword, password) {
  try {
    const validation = await bcrypt.compare(password, userPassword)
    return validation
  } catch (error) {
    throw new Error('No se puede validar la contraseña')
  }
}

export { validatePassword }
