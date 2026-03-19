const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

const cacheMiddleware = (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  // Generate a unique key based on URL and query parameters
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cachedResponse);
  } else {
    res.setHeader('X-Cache', 'MISS');
    // Override res.json to cache the response before sending
    const originalJson = res.json;
    res.json = function (body) {
      cache.set(key, body);
      originalJson.call(this, body);
    };
    next();
  }
};

module.exports = { cache, cacheMiddleware };
