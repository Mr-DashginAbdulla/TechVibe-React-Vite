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

/**
 * Invalidate all cache entries that start with the given prefix.
 * Example: invalidateCache("/api/products") clears all product-related cache entries.
 * @param {string} prefix - URL prefix to match against cached keys
 */
const invalidateCache = (prefix) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter((key) => key.startsWith(prefix));
  if (keysToDelete.length > 0) {
    cache.del(keysToDelete);
  }
};

/**
 * Middleware factory that invalidates cache for a given route prefix
 * after a successful POST/PATCH/DELETE operation.
 * Usage: router.post("/", invalidateCacheMiddleware("/api/products"), handler)
 * @param {string} prefix - URL prefix to invalidate
 */
const invalidateCacheMiddleware = (prefix) => {
  return (req, res, next) => {
    // Hook into res.json to invalidate cache after successful response
    const originalJson = res.json;
    res.json = function (body) {
      // Only invalidate on successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        invalidateCache(prefix);
      }
      originalJson.call(this, body);
    };
    next();
  };
};

module.exports = { cache, cacheMiddleware, invalidateCache, invalidateCacheMiddleware };
