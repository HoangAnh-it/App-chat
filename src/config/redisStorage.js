function redisStore(session) {
    const RedisStore = require('connect-redis')(session);
    const { createClient } = require('redis');
    const redisClient = createClient({ legacyMode: true });
    redisClient.connect().catch(console.error);
    return new RedisStore({
        client: redisClient
    });
}

module.exports = redisStore;
