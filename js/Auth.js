export class Auth {
    constructor(setting, appManager, cache, apiRequest) {
        this.setting = setting;
        this.appManager = appManager;
        this.cache = cache;
        this.apiRequest = apiRequest;
        this.idToken = null;

        this.idTokenCacheKey = 'product-id-token';
    }

    getCacheKey(appCode) {
        return 'access-token:' + appCode;
    }

    async accessByCode(code, state) {
        const appCode = this.appManager.mainAppCode;

        const accessUrl = await this.appManager.fetchApiUrl(
            appCode,
            'oauth2access'
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
        const idToken = this.getIdToken();
        if (!idToken) {
            throw new Error('not-login');
        }
        const accessUrl = await this.appManager.fetchApiUrl(
            appCode,
            'oauth2access'
        );

        const accessToken = await this.apiRequest.postJson(
            accessUrl,
            {
                appId: this.setting.client.appId,
                grantType: 'openId',
                idToken: idToken
            }
        );

        await this.cache.set(cacheKey, accessToken);
    }
}
