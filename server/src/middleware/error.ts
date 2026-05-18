import type { NextFunction, Request, Response } from 'express';
import { InvalidTransitionError } from '../utils/statusMachine';

export class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof InvalidTransitionError) {
    return res.status(409).json({
      error: 'InvalidTransition',
      message: err.message,
      from: err.from,
      to: err.to,
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.name, message: err.message });
  }
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'NotFound', message: 'Route not found' });
}
