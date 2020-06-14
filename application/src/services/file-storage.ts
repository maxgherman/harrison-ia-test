import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { aws } from '../utils/environment'
import { FileStorageItem } from './entities'

const s3 = new AWS.S3(aws.credentials)


export type FileStorageService = {
    upload: (file: FileStorageItem) => Promise<string>
    download: (id: string) => Promise<FileStorageItem>
}

export const fileStorageService = (): FileStorageService => ({
    upload: (file: FileStorageItem): Promise<string> =>
        new Promise((resolve, reject) => {

            const id = uuidv4()

            s3.upload({
                Bucket: aws.s3,
                Key: id,
                Body: file.contents,
                Metadata: { 'file-name': file.fileName }
            }, (error) => {
                if(error) {
                    reject(error)
                    return
                }

                resolve(id)
            })
        }),


    download: (id: string): Promise<FileStorageItem> =>
        new Promise((resolve, reject) => {
            s3.getObject({
                Bucket: aws.s3,
                Key: id
            }, (error, data) => {
                if(error) {
                    reject(error)
                    return
                }

                if(!data.Metadata) {
                    reject(new Error('Metadata not found'))
                    return
                }

                if(!data.Body) {
                    reject(new Error('Body not found'))
                    return
                }

                resolve({
                    fileName: data.Metadata['file-name'],
                    contents: data.Body as Buffer
                })
            })
        })
})
