export class IdTokenStore {
    constructor(cache) {
        this.cache = cache;
    }

    getCacheKey(companyCode) {
        return 'id-token-' + companyCode;
    }

    async asSet(companyCode, idToken) {
        await this.cache.set(this.getCacheKey(companyCode), idToken);
    }

    async asGet(companyCode) {
        return await this.cache.get(this.getCacheKey(companyCode));
    }
}
