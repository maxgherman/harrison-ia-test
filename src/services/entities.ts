import { User as RepositoryUser } from '../repositories'

export type User = RepositoryUser

export type Result<T> = {
    success: boolean
    value: T
}