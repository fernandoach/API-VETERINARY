import { getUserInfoForId } from '../../repositories/userRepository/getUserInfoForId.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'

async function getAuthUserInfoController (req, res) {
  try {
    const idUser = await getAuthIdUser(req)

    // TODO: Implementar caché con Redis para evitar múltiples consultas a la base de datos

    const userInfo = await getUserInfoForId(idUser)

    if (!userInfo || userInfo === -1) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    return res.status(200).json(userInfo)
  } catch (error) {
    console.error('Error al obtener información del usuario autenticado:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { getAuthUserInfoController }
