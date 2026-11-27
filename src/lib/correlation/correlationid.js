import crypto from 'crypto';

export function correlationId(req, res, next) {
    const id = req.headers['x-correlation-id'] || crypto.randomUUID();
    req.correlationId = id;
    res.setHeader('x-correlation-id', id);
    next();
}

