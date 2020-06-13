import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import session from 'express-session'
import passport from 'passport'
import { environment, server } from './utils/environment'
import { logErrors, errorMiddleware, authentication } from './utils/middleware'
import { Controller } from './routes/common'

export class App {
    public app: express.Application

    constructor(controllers: Controller[]) {
        this.app = express()

        this.initializeMiddleware()
        this.initializeControllers(controllers)
    }

    private initializeMiddleware() {

        this.app.set("trust proxy", 1)
        this.app.set('views', path.join(__dirname, '../views'))
        this.app.set("view engine", "ejs")

        this.app.use(logger(environment.value))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(cookieParser())
        this.app.use(express.static(path.join(__dirname, "../public")))
        this.app.use(
            session({
                secret: server.sessionSecret,
                resave: false,
                saveUninitialized: true,
                cookie: {
                    maxAge: 60 * 60 * 1000, // 1 hour
                    // secure: true, // HTTPS
                    sameSite: true
                }
            })
        )
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(authentication)
        this.app.use(logErrors)
        this.app.use(errorMiddleware)
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router)
        })
    }

    public listen(): void {
        this.app.listen(server.port, () => {
            console.log(`App listening on the port ${server.port}`)
        })
    }
}
