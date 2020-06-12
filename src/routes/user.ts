import express from 'express'
import { Magic, MagicUserMetadata } from "@magic-sdk/admin"
import passport from "passport"
import * as passportStrategy from "passport-magic"
import { MagicUser, DoneFunc} from "passport-magic"

export const router = express.Router()
const magic = new Magic(process.env.MAGIC_SECRET_KEY)

const MagicStrategy = passportStrategy.Strategy

const strategy = new MagicStrategy(async (user: MagicUser, done: DoneFunc) => {
  const userMetadata = await magic.users.getMetadataByIssuer(user.issuer)
  // TODO check DB user
  const existingUser = false
  
  if (!existingUser) {
    /* Create new user if doesn't exist */
    return signup(user, userMetadata, done)
  } else {
    /* Login user if otherwise */
    return login(user, done)
  }
})

passport.use(strategy)

/* Implement User Signup */
const signup = async (user: MagicUser, userMetadata: MagicUserMetadata, done: DoneFunc) => {
  const newUser = {
    issuer: user.issuer,
    email: userMetadata.email,
    lastLoginAt: user.claim.iat
  }
  
  //TODO: Insert user into DB

  return done(null, newUser)
}

/* Implement User Login */
const login = async (user: MagicUser, done: DoneFunc) => {
  
  // TODO: extend 3rd party API to support typescript validation
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (user.claim.iat <= user.lastLoginAt) {
    return done(null, false, {
      message: `Replay attack detected for user ${user.issuer}}.`
    })
  }
  
  //TODO: update user metadata

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
passport.deserializeUser(async (id, done) => {
  try {
    //TODO: Find user DB
    const user = {}
    done(null, user)
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