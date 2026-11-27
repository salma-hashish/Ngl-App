import Redis from "ioredis";

export class RedisCacheProvider {
  client;

  constructor(config = {}) {
    this.client = new Redis({
      host: config.host || '127.0.0.1',
      port: config.port || 6379,
      password: config.password || undefined,
      maxLoadingRetryTime: 3,
      lazyConnect: true,
    });

    this.client.on('error', (err) => {
      console.log('fail to redis client error: ', err.message);
    });

    this.client.connect().catch((err) => {
      console.log('connection error: ', err.message);
    });
  }

  async set(key, value, ttl = 60) {
    if (ttl > 0) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async get(key) {
    return this.client.get(key);
  }

  async del(key) {
    return this.client.del(key);
  }
}

