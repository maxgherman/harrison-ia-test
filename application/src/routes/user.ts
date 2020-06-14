import express from 'express'
import { Magic } from '@magic-sdk/admin'
import passport from 'passport'
import * as passportStrategy from 'passport-magic'
import { MagicUser, DoneFunc } from 'passport-magic'
import { UserService, User } from '../services'
import { HttpException } from '../utils/errors'
import { Controller } from './common'

export const userController = (userService: UserService): Controller => {

    const router = express.Router()
    const magic = new Magic(process.env.MAGIC_SECRET_KEY)

    const MagicStrategy = passportStrategy.Strategy

    const strategy = new MagicStrategy(async (user: MagicUser, done: DoneFunc) => {
        const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)
        const userResult = await userService.getUserByEmail(userMetadata.email as string)

        if (!userResult.success) {
            throw 'Unauthorized login'
        } else {
            login(user, userResult.value)
            return done(null, user)
        }
    })

    /* Implement User Login */
    const login = async (user: MagicUser, userEntity?: User) => {
        if(userEntity) {
            userService.updateIssuer(user.issuer, userEntity.id)
        }
    }

    /* Attach middleware to login endpoint */
    router.post("/login", passport.authenticate("magic"), (req, res) => {
        if (req.user) {
            res.status(200).end('User is logged in.')
        } else {
            return res.status(401).end('Could not log user in.')
        }
    })

    /* Session */
    passport.use(strategy)

    passport.serializeUser((user: MagicUser, done) => {
        done(null, user.issuer)
    })

    /* Populates user data in the req.user object */
    passport.deserializeUser(async (id: string, done) => {
        try {
            const userResult = await userService.getUserByIssuer(id)
            if (userResult.success) {
                done(null, userResult.value)
            } else
                done(new HttpException(401, 'Unauthorized login'), null)
        } catch (err) {
            done(err, null)
        }
    })

    /* Routes */
    router.get("/", async (req, res) => {
        if (req.isAuthenticated()) {

            return res
                .status(200)
                .json(req.user)
                .end()
        } else {
            return res.status(401).end(`User is not logged in.`)
        }
    })

    router.post("/logout", async (req, res) => {
        const user = req.user as MagicUser

        if (req.isAuthenticated()) {
            await magic.users.logoutByIssuer(user.issuer)
            req.logout()
            return res.status(200).end()
        } else {
            return res.status(401).end(`User is not logged in.`)
        }
    })

    return {
        path: '/user',
        router
    }
}
