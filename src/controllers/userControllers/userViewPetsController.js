import { getPetsByIdUser } from '../../repositories/petRepository/getPetsByIdUser.js'
import { getAuthIdUser } from '../../utils/getAuthIdUser.js'

async function userViewPetsController (req, res) {
  try {
    // Obtener el token de autorización desde el encabezado
    const authorization = req.header('Authorization')

    // Obtener el ID del usuario a partir del token JWT
    const idUser = await getAuthIdUser(authorization)

    // Obtener todas las mascotas registradas del usuario
    const pets = await getPetsByIdUser(idUser)

    // Retornar la lista de mascotas
    return res.status(200).json({ pets })
  } catch (error) {
    console.error('Error al obtener mascotas del usuario:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado')

    return res.status(400).json({ message })
  }
}

export { userViewPetsController }
