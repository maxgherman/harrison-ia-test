import express from 'express'
import { LabelService } from '../services'
import { Controller } from './common'

export const labelController = (labelService: LabelService): Controller => {

    const router = express.Router()

    router.get("/", async (request, response) => {
        const data = await labelService.getLabels()

        return response
            .status(200)
            .json(data)
            .end()
    })

    router.get("/:id", async (request, response) => {
        const id = request.params.id
        const data = await labelService.getLabelById(id)

        if(data.success) {
            return response
            .status(200)
            .json(data.value)
            .end()
        }

        return response
            .status(404)
            .end()
    })

    router.post("/", async (request, response) => {
        const { value }: { value: string } = request.body

        if(!value) {
            return response
            .status(400)
            .json('value is required')
            .end()
        }

        const { id } = await labelService.createLabel(value)

        return response
            .status(201)
            .location(`/labels/${id}`)
            .end()
    })

    router.put("/:id", async (request, response) => {
        const id = request.params.id
        const { value }: { value: string } = request.body

        if(!value) {
            return response
            .status(400)
            .json('value is required')
            .end()
        }

        const data = await labelService.updateLabel(id, value)

        if(!data.success) {
            return response
            .status(404)
            .json('Record not found')
            .end()
        }

        return response
            .status(200)
            .end()
    })

    return {
        path: '/labels',
        router
    }
}
