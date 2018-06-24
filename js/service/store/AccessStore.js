export class AccessStore {
    constructor(cache) {
        this.cache = cache;
        this.cachedAppCodes = [];
    }

    getCacheKey(appCode) {
        return 'access-token-' + appCode;
    }

    async asSet(appCode, accessToken) {
        const cacheKey = this.getCacheKey(appCode);
        accessToken.localExpired = this.calLocalExpired(accessToken);
        await this.cache.set(cacheKey, accessToken);
    }

    async asGet(appCode) {
        const cacheKey = this.getCacheKey(appCode);
        const cachedAccessToken = await this.cache.get(cacheKey);
        if (!cachedAccessToken) {
            return null;
        }

        if (this.isExpiredAccessToken(cachedAccessToken)) {
            return null;
        }

        return cachedAccessToken;
    }

    isExpiredAccessToken(accessToken) {
        const localExpired = parseInt(accessToken.localExpired);
        if (isNaN(localExpired)) {
            return true;
        }

        return ((new Date()).getTime() > localExpired);
    }

    calLocalExpired(accessToken) {
        const remoteCreated = (new Date(accessToken.created)).getTime();
        const localCreated = (new Date()).getTime();

        const remoteExpired = (new Date(accessToken.expired)).getTime();
        const localOffset = 300000; // 5 minute
        const localExpired = remoteExpired + (localCreated - remoteCreated)  - localOffset;
        return localExpired;
    }
}

