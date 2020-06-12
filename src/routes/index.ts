import express from 'express'

const MAGIC_PUBLISHABLE_KEY = process.env.MAGIC_PUBLISHABLE_KEY

export const router = express.Router()

// GET home page
router.get("/", (_, res) => {
  res.render("index", { title: "Magic Apple Store 🍎", MAGIC_PUBLISHABLE_KEY })
})