import {cacheProvider} from "./init.js";

export function withCache(ttl = 3600) {
    return async (req, res, next) => {
        let key = `${req.method}:${req.originalUrl}`;// GET:/user
        const cached = await cacheProvider.get(key);
        if (cached) {
            res.setHeader('X-Cache', 'Hit');
            return res.json(JSON.parse(cached));
        }

        const originalJson = res.json.bind(res);// res.json(body);

        res.json = (async (body) => {
            await cacheProvider.set(key, JSON.stringify(body), ttl);
            res.setHeader('X-Cache', 'Miss');
            return originalJson(body);
        });
        next();
    }
}