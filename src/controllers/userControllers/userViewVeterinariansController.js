import { getVeterinarians } from '../../repositories/veterinaryRepository/getVeterinarians.js'

async function userViewVeterinariansController (req, res) {
  try {
    // Obtener la lista de todos los veterinarios desde el repositorio
    const veterinarians = await getVeterinarians()

    // Retornar la lista en formato JSON
    return res.status(200).json({ veterinarians })
  } catch (error) {
    console.error('Error al obtener veterinarios:', error)

    const message =
      error?.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado al obtener la lista de veterinarios.')

    return res.status(400).json({ message })
  }
}

export { userViewVeterinariansController }
