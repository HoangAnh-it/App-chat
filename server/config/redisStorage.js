const redis = require('redis');

function createStoreRedis(session) {
    const redisStore = require('connect-redis')(session);
    const redisClient = redis.createClient({legacyMode: true });
    redisClient.connect().catch(console.err);
    return new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient,
    })
}

module.exports = createStoreRedis;