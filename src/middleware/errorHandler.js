import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
    const isHttpError = err instanceof HttpError;

    const statusCode = isHttpError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ message });
}
