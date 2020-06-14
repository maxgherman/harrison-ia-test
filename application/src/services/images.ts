import { ImageRepository, imageRepository } from '../repositories'
import { FileStorageService, fileStorageService } from './file-storage'
import { Image, Result, FileStorageItem } from './entities'
import { logger } from '../utils/logger'

export type ImageService = {
    getImageById(id: string): Promise<Result<Image>>
    getImages(): Promise<Image[]>
    getImageData(id: string): Promise<Result<FileStorageItem>>
    createImage(
        fileName: string,
        contents: Buffer,
        status: string,
        labelIds: string[]): Promise<{ id: number }>
    updateImage(id: string, status?: string, labelsIds?: string[]): Promise<Result<unknown>>
}

const getImageById = (repository: ImageRepository) => (id: string): Promise<Result<Image>> =>
    repository.getImageById(id)
    .then(data => {
        if(!data) {
            return {
                success: false
            }
        }

        data.fileName = ''

        return {
            value: data,
            success: true
        }
    })

export const imageService = (
    repository: ImageRepository = imageRepository(),
    imageStorageService: FileStorageService = fileStorageService()): ImageService => {

    const imageById = getImageById(repository)

    return {
        getImageById: imageById,

        getImages: (): Promise<Image[]> =>
            repository.getImages()
            .then(data => data.map(item => ({...item, fileName: ''}))),

        getImageData: (id: string): Promise<Result<FileStorageItem>> =>
            repository.getImageById(id)
            .then(data => {
                if(!data) {
                    return {
                        success: false
                    }
                }

                return imageStorageService.download(data.fileName)
                .then(imageData => {
                    return {
                        success: true,
                        value: imageData
                    }
                })
                .catch<Result<FileStorageItem>>(error => {
                    logger.error(error)

                    return {
                        success: false
                    }
                })
            }),

        createImage: (
            fileName: string,
            contents: Buffer,
            status: string,
            labelIds: string[]): Promise<{ id: number }> =>

            imageStorageService.upload({
                fileName,
                contents
            })
            .then((id) => {
                return repository.createImage(id, status, labelIds)
            }),

        updateImage: (id: string, status?: string, labelsIds?: string[]): Promise<Result<unknown>> =>
            new Promise<Result<unknown>>((resolve) => {
                if(!status && !labelsIds) {
                    resolve({
                        success: false
                    })
                    return
                }

                imageById(id)
                .then(result => {
                    if(!result.success) {
                        resolve({
                            success: false
                        })
                        return
                    }

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const existingImage = result.value!

                    const newStatus = status || existingImage.status
                    const newLabelsIds = labelsIds || Object.keys(existingImage.labels)

                    repository.updateImage(id, newStatus, newLabelsIds)
                    .then(() => {
                        resolve({
                            success: true,
                        })
                    })
                })
            })
        }
}
