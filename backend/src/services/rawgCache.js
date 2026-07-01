class MemoryCache {
  constructor(defaultTtlMs) {
    this.cache = new Map();
    this.defaultTtl = defaultTtlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtl) {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const detailsCache = new MemoryCache(60 * 60 * 1000); // 1 hour
export const searchCache = new MemoryCache(5 * 60 * 1000);   // 5 minutes
