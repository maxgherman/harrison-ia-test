import express from 'express'
import { Controller } from './common'

export const mainController = (): Controller => {

    const MAGIC_PUBLISHABLE_KEY = process.env.MAGIC_PUBLISHABLE_KEY

    const router = express.Router()

    // GET home page
    router.get("/", (_, res) => {
        res.render("index", { title: "HARRISON-AI TEST ", MAGIC_PUBLISHABLE_KEY })
    })

    return {
        path: '/',
        router
    }
}
