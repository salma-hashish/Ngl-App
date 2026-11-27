import {cacheProvider} from "../cache/init.js";
import {AppError} from "../../pkg/error/error.js";

function idempotency({ttl = 3600, strict = false}) {
    return async function (req, res, next) {
        const idempotency = req.headers['idempotency-key'];
        if (!idempotency) {
            if (strict) throw new AppError('missed idempotency key', 400);
            return next();
        }
        console.log(idempotency);
        let key = `${req.method}:${req.originalUrl}:${idempotency}`;
        const cached = await cacheProvider.get(key);

        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const originalJson = res.json.bind(res);

        res.json = ((body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log(key);
                cacheProvider.set(key, JSON.stringify(body), ttl);
            }
            return originalJson(body);
        });
        next();
    }
}

export default idempotency