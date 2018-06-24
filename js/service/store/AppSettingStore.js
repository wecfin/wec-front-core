export class AppSettingStore {
    constructor(cache) {
        this.cache = cache;
    }

    getCacheKey(appCode) {
        return 'app-' + appCode;
    }

    async asSet(appCode, appSetting) {
        await this.cache.set(this.getCacheKey(appCode), appSetting);
    }

    async asGet(appCode) {
        return await this.cache.get(this.getCacheKey(appCode));
    }
}
