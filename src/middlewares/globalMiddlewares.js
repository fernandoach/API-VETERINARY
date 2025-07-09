import { json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

function globalMiddlewares (app) {
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(cors())
  app.use(cookieParser())
}

export { globalMiddlewares }
