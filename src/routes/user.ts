import express from 'express'
import { Magic } from '@magic-sdk/admin'
import passport from 'passport'
import * as passportStrategy from 'passport-magic'
import { MagicUser, DoneFunc} from 'passport-magic'
import { userService, User } from '../services'
import { HttpException } from '../utils/errors'

export const router = express.Router()

const users = userService()
const magic = new Magic(process.env.MAGIC_SECRET_KEY)

const MagicStrategy = passportStrategy.Strategy

const strategy = new MagicStrategy(async (user: MagicUser, done: DoneFunc) => {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)
  const userResult = await users.getUserByEmail(userMetadata.email as string)

  if (!userResult.success) {
    throw 'Unauthorized login'
  } else {
    return login(user, userResult.value, done)
  }
})

passport.use(strategy)

/* Implement User Login */
const login = async (user: MagicUser, userEntity: User, done: DoneFunc) => {
  
  users.updateIssuer(user.issuer, userEntity.id)

  //TODO: implement addition login checks
  return done(null, user)
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

/* Defines what data are stored in the user session */
passport.serializeUser((user: MagicUser, done) => {
  done(null, user.issuer)
})

/* Populates user data in the req.user object */
passport.deserializeUser(async (id: string, done) => {
  try {
    const userResult = await users.getUserByIssuer(id)
    if(userResult.success) {
      done(null, userResult.value)
    } else 
    done(new HttpException(401, 'Unauthorized login'), null)
  } catch (err) {
    done(err, null)
  }
})

/* Implement Get Data Endpoint */
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

/* Implement Logout Endpoint */
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