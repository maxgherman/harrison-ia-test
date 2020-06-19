import { pool } from './pool'
import { User } from './entities'

export type UserRepository = {
    getUserByEmail(email: string): Promise<User>
    getUserByIssuer(issuer: string): Promise<User>
    updateIssuer(issuer: string, id: string): Promise<void>
}

export const userRepository = (): UserRepository => ({

    getUserByEmail: (email: string): Promise<User> =>
        pool.query('SELECT id, issuer, email FROM users where email=$1', [ email ])
        .then(({ rows}) => rows[0]),

    getUserByIssuer: (issuer: string): Promise<User> =>
        pool.query('SELECT id, issuer, email FROM users where issuer=$1', [ issuer ])
        .then(({ rows}) => rows[0]),

    updateIssuer: (issuer: string, id: string): Promise<void> =>
        pool.query('UPDATE users SET issuer = $1 where id=$2', [ issuer, id ])
        .then(({ rows}) => rows[0])
})
