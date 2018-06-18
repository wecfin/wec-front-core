export class Auth {
    constructor(setting, cache, apiRequest, appManager) {
        this.setting = setting;
        this.appManager = appManager;
        this.cache = cache;
        this.apiRequest = apiRequest;
        this.idToken = null;

        this.observers = [];

        this.idTokenCacheKey = 'product-id-token';
        this.accessRoute = 'oauth2Access';
    }

    isLogined() {
        return (this.idToken) ? true : false;
    }

    async logout() {
        this.idToken = null;
        await this.cache.clear();
    }

    attach(observer) {
        this.observers.push(observer);
    }

    getCacheKey(appCode) {
        return 'access-token:' + appCode;
    }

    async accessByCode(code, state) {
        const appCode = this.appManager.mainAppCode;

        const accessUrl = await this.appManager.fetchApiUrl(
            appCode,
            this.accessRoute
        );
        const accessToken = await this.apiRequest.postJson(
            accessUrl,
            {
                appId: this.setting.client.appId,
                grantType: 'authCode',
                code: code,
                state: state
            }
        );

        if (accessToken.idToken) {
            await this.setIdToken(accessToken.idToken);
            delete(accessToken.idToken);
        }

        await this.cache.set(
            this.getCacheKey(appCode),
            accessToken
        );
    }

    async setIdToken(idToken) {
        this.idToken = idToken;
        await this.cache.set(this.idTokenCacheKey, idToken);
    }

    async getIdToken() {
        if (this.idToken) {
            return this.idToken;
        }

        this.idToken = await this.cache.get(this.idTokenCacheKey);
        return this.idToken;
    }

    async clearIdToken() {
        await this.cache.remove(this.idTokenCacheKey);
    }

    async setAccessToken(appCode, accessToken) {
        const cacheKey = this.getCacheKey(appCode);
        await this.cache.set(cacheKey, accessToken);
    }

    async fetchAccessToken(appCode) {
        const cacheKey = this.getCacheKey(appCode);
        const cachedAccessToken = await this.cache.get(cacheKey);
        if (cachedAccessToken) {
            return cachedAccessToken;
        }
        const idToken = await this.getIdToken();
        if (!idToken) {
            throw new Error('not-login');
        }
        const accessUrl = await this.appManager.fetchApiUrl(
            appCode,
            this.accessRoute
        );

        const currentAppSetting = await this.appManager.fetchAppSetting(
            this.setting.currentAppCode
        );

        const accessToken = await this.apiRequest.postJson(
            accessUrl,
            {
                appId: currentAppSetting.appId,
                grantType: 'openId',
                idToken: idToken
            }
        );

        await this.cache.set(cacheKey, accessToken);
        return accessToken;
    }

    async removeAccessToken(appCode) {
        await this.cache.remove(this.getCacheKey(appCode));
    }

    async clearAccessTokens() {
        for (const appCode of this.appManager.cachedAppCodes) {
            await this.removeAccessToken(appCode);
        }
    }
}
