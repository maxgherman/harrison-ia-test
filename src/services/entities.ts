import {
    User as RepositoryUser,
    Label as RepositoryLabel,
    Image as RepositoryImage
} from '../repositories'

export type User = RepositoryUser

export type Label = RepositoryLabel

export type Image = RepositoryImage & {
    labels: { [key: string]: Label }
}

export type FileStorageItem = {
    fileName: string
    contents: Buffer
}

export type Result<T> = {
    success: boolean
    value?: T
}
