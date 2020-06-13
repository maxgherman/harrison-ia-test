import { UserRepository, userRepository } from '../repositories'
import { User, Result } from './entities'

export type UserService = {
    getUserByEmail(email: string): Promise<Result<User>>
    getUserByIssuer(issuer: string): Promise<Result<User>>
    updateIssuer(issuer: string, id: string): Promise<void>
}

export const userService = (repository: UserRepository = userRepository()): UserService => ({
    getUserByEmail: (email: string): Promise<Result<User>> =>
        repository.getUserByEmail(email)
        .then(data => ({
            value: data,
            success: !!data
        })),

    getUserByIssuer: (issuer: string): Promise<Result<User>> =>
        repository.getUserByIssuer(issuer)
        .then(data => ({
            value: data,
            success: !!data
        })),

    updateIssuer: (issuer: string, id: string): Promise<void> =>
        repository.updateIssuer(issuer, id),

})