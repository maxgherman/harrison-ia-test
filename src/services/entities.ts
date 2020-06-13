import {
    User as RepositoryUser,
    Label as RepositoryLabel
} from '../repositories'

export type User = RepositoryUser

export type Label = RepositoryLabel

export type Result<T> = {
    success: boolean
    value?: T
}
