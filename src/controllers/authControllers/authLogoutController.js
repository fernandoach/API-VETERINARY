async function authLogoutController (req, res) {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    })
    return res.json({ message: 'Sesión terminada.' })
  } catch (error) {
    console.error('Error en :', error)

    const message =
      error.details?.[0]?.message ||
      (error instanceof Error ? error.message : 'Error inesperado.')

    return res.status(400).json({ message })
  }
}

export { authLogoutController }
