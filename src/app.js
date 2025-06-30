import express from 'express'
import { globalMiddlewares } from './middlewares/globalMiddlewares.js'
import { userRouter } from './routes/userRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import { veterinaryRouter } from './routes/veterinaryRoutes.js'

const PORT = process.env.PORT || 3000
const DOMAIN = process.env.DOMAIN || 'localhost'
const PROTOCOL = (process.env.PROTOCOL || 'http')

const server = express()

globalMiddlewares(server)

server.use('/user', userRouter)
server.use('/auth', authRouter)
server.use('/veterinary', veterinaryRouter)

server.get('/', (req, res) => {
  return res.json({ message: 'VETERINARY' })
})

server.listen(PORT, () => {
  console.log(`Server on: ${PROTOCOL}://${DOMAIN}:${PORT}`)
})
