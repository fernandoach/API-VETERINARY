import { json, urlencoded } from 'express'
import cors from 'cors'

function globalMiddlewares (app) {
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(cors())
}

export { globalMiddlewares }
