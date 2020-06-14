import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger'

export function userDetector(
    request: Request, response: Response, next: NextFunction): void {

    if(request.isAuthenticated()) {
        const user = request.user as { email: string}
        const message = `Detected user activity: ${user.email}, path: ${request.path}`
        logger.log('info', message)

    }

    next()
}
