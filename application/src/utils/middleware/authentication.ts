import { Request, Response, NextFunction } from 'express'

export function authentication(
    request: Request, response: Response, next: NextFunction): void {

    if (request.path === '/' || request.path.startsWith('/user') ||
        request.isAuthenticated()) {
        next()
    } else {
        return response.status(401).end(`User is not logged in.`)
    }
}
