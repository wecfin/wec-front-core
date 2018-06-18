const prefix = '@web:session:';

export class WebCache {
    async get(key) {
        const cacheKey = this.getCacheKey(key);
        const res = window.sessionStorage.getItem(cacheKey);
        if (!res) {
            return null;
        }
        return JSON.parse(res);
    }

    async set(key, obj) {
        window.sessionStorage.setItem(
            this.getCacheKey(key),
            JSON.stringify(obj)
        );
    }

    async remove(key) {
        window.sessionStorage.removeItem(
            this.getCacheKey(key)
        );
    }

    async clear() {
        window.sessionStorage.clear();
    }

    getCacheKey(key) {
        return prefix + key;
    }
}
