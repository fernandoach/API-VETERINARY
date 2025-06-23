import express from 'express'
import { globalMiddlewares } from './middlewares/globalMiddlewares.js'
import { userRouter } from './routes/userRoutes.js'
import { loginRouter } from './routes/loginRoutes.js'

const PORT = process.env.PORT || 3000
const DOMAIN = process.env.DOMAIN || 'localhost'
const PROTOCOL = (process.env.PROTOCOL || 'http')

const server = express()

globalMiddlewares(server)

server.use('/user', userRouter)
server.use('/login', loginRouter)

server.get('/', (req, res) => {
  return res.json({ message: 'VETERINARY' })
})

server.listen(PORT, () => {
  console.log(`Server on: ${PROTOCOL}://${DOMAIN}:${PORT}`)
})
