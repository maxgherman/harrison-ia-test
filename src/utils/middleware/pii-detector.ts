import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger'

export function piiDetector(
    request: Request, response: Response, next: NextFunction): void {

    if(request.isAuthenticated()) {
        const user = request.user as { email: string; issuer: string}

        const message = `Detected personal information:
            ${user.email},
            ${user.issuer},
            ${request.ip},
            ${request.rawHeaders.join(',')}`
        logger.log('info', message)

    }

    next()
}
