import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../errors'

export function errorMiddleware(
    error: HttpException,
    request: Request, response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: NextFunction): void {

  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  response
    .status(status)
    .send({
      status,
      message,
    })
}
