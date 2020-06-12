import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import passport from 'passport'
import { AddressInfo } from 'net'

import { router as indexRouter } from "./routes/index"
import { router as userRouter } from "./routes/user"

const app = express()
app.set("trust proxy", 1)
app.set('views', path.join(__dirname, '../views'))
app.set("view engine", "ejs")

app.use(logger(process.env.ENVIRONMENT!))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour
      // secure: true, // HTTPS
      sameSite: true
    }
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use("/", indexRouter)
app.use("/user", userRouter)

const listener = app.listen(parseInt(process.env.PORT!), () => {
  const address = listener.address()! as AddressInfo
  console.log("Listening on port " + address.port)
})
