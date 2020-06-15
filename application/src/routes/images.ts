import express from 'express'
import { UploadedFile } from 'express-fileupload'
import { ImageService } from '../services'
import { Controller } from './common'

export const imageController = (imageService: ImageService): Controller => {

    const router = express.Router()

    router.get("/", async (request, response) => {
        const data = await imageService.getImages()

        return response
            .status(200)
            .json(data)
            .end()
    })

    router.get("/:id", async (request, response) => {
        const id = request.params.id
        const data = await imageService.getImageById(id)

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

    router.get("/:id/contents", async (request, response) => {
        const id = request.params.id
        const data = await imageService.getImageData(id)

        if(data.success) {
            response.writeHead(200, {
                'Content-Type': 'octet/stream',
                'Content-disposition': `attachment;filename=${data.value?.fileName}`,
            })

            response.end(data.value?.contents)
            return response
        }

        return response
            .status(404)
            .end()
    })

    router.post('/', async (request, response) => {

        if (!request.files || Object.keys(request.files).length !== 1) {
            return response
                .status(400)
                .send('Unsupported number of files. looking for 1 file.')
        }

        const body = request.body as {
            status: string
            'labelIds[]': string[]
        }

        if(!body.status) {
            return response
                .status(404)
                .send('Missing image status')
        }

        if(body['labelIds[]'] && !Array.isArray(body['labelIds[]'])) {
            return response
                .status(404)
                .send('labelIds format is not supported')
        }

        const file = request.files[Object.keys(request.files)[0]] as UploadedFile

        const data = await imageService.createImage(
            file.name,
            file.data,
            body.status,
            body['labelIds[]']
        )

        return response
            .status(201)
            .location(`/images/${data.id}`)
            .json(data)
            .end()
    })

    router.put("/:id", async (request, response) => {
        const id = request.params.id
        const body: { status?: string; 'labelIds[]'?: string[]  } = request.body

        if((!body.status && !body["labelIds[]"]) || !Array.isArray(body["labelIds[]"])) {
            return response
            .status(400)
            .json('Missing image properties')
            .end()
        }

        const data = await imageService.updateImage(id, body.status, body["labelIds[]"])

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
        path: '/images',
        router
    }
}
