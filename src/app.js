import express from 'express'

const PORT = process.env.PORT || 3000
const DOMAIN = process.env.DOMAIN || 'localhost'
const PROTOCOL = (process.env.PROTOCOL || 'http')

const server = express()

server.get('/ping', (req, res) => {
  return res.send('pong...')
})

server.listen(PORT, () => {
  console.log(`Server on: ${PROTOCOL}://${DOMAIN}:${PORT}`)
})
