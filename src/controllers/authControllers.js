import { editUserPasswordForId } from '../repositories/userRepository/editUserPasswordForId.js'
import { getIdUserForEmail } from '../repositories/userRepository/getIdUserForEmail.js'
import { getUserHashedPassword } from '../repositories/userRepository/getUserHashedPassword.js'
import { getUserInfoForId } from '../repositories/userRepository/getUserInfoForId.js'
import { getAuthIdUser } from '../utils/getAuthIdUser.js'
import { hashPassword } from '../utils/hashPassword.js'
import { signJWT } from '../utils/signJWT.js'
import { validatePassword } from '../utils/validatePassword.js'
import { passwordSchema } from '../validations/passwordsSchema.js'

async function loginController (req, res) {
  try {
    const { email, password } = req.body

    const idUser = await getIdUserForEmail(email)
    if (idUser === -1) throw new Error('Usuario y/o contraseña invalidos.')

    const userPassword = await getUserHashedPassword(idUser)
    if (userPassword === -1) throw new Error('Usuario y/o contraseña invalidos.')

    const validation = await validatePassword(userPassword, password)
    if (validation) {
      const jwt = signJWT(idUser)
      return res.json({ accesToken: jwt })
    } else {
      return res.status(400).json({ message: 'Usuario y/o contraseña invalidos.' })
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function getUserInfoForIdController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    return res.json({ idUser })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function getAuthUserInfoController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    const userInfo = await getUserInfoForId(idUser)
    return res.json(userInfo)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

async function changePasswordController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)
    const { password, repassword } = req.body
    await passwordSchema.validateAsync({ password, repassword })

    const hashedPassword = await hashPassword(password)

    const result = await editUserPasswordForId(idUser, hashedPassword)
    if (result) return res.send({ message: 'Contraseña actualizada correctamente.' })
    throw new Error(' ')
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(400).json(error.details[0].message ? { message: error.details[0].message } : { message: 'Error inesperado' })
  }
}

export { loginController, getUserInfoForIdController, getAuthUserInfoController, changePasswordController }
