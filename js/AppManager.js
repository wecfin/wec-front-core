export class AppManager {
    constructor(setting, cache, apiRequest) {
        this.mainAppCode = setting.mainAppCode;
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.appSettings = {};
        this.cachedAppCodes = [];
    }

    getCacheKey(appCode) {
        return 'app:' + appCode;
    }

    getAppSetting(appCode) {
        return this.appSettings[appCode];
    }

    async fetchApiUrl(appCode, api) {
        const appSetting = await this.fetchAppSetting(appCode);
        return this.generateUrl(appSetting, api);
    }

    async fetchAppSetting(appCode) {
        if (this.appSettings[appCode]) {
            return this.appSettings[appCode];
        }

        const cacheKey = this.getCacheKey(appCode);
        const cachedAppSetting = await this.cache.get(cacheKey);
        if (cachedAppSetting) {
            this.appSettings[appCode] = cachedAppSetting;
            return cachedAppSetting;
        }

        const appSetting = this.setting.app[appCode];
        if (!appSetting) {
            throw new Error('cannot find appSetting: ' + appCode);
        }

        const homeUrl = this.generateUrl(appSetting, 'home');
        const remoteAppSetting = await this.apiRequest.postJson(homeUrl);
        if (!remoteAppSetting) {
            throw new Error('cannot find app: ' + appCode);
        }
        await this.cache.set(cacheKey, remoteAppSetting);
        this.cachedAppCodes.push(appCode);
        this.appSettings[appCode] = remoteAppSetting;
        return remoteAppSetting;
    }

    generateUrl(appSetting, api) {
        const route = appSetting.route[api];
        if (!route) {
            throw new Error('cannot find api: ' + api);
        }

        const siteSetting = appSetting.site[route.site];
        if (!siteSetting) {
            throw new Error('cannot find site ' + route.site);
        }

        const baseUrl = siteSetting.baseUrl;
        if (!baseUrl) {
            throw new Error('connt find site: ' + route.site);
        }

        return (siteSetting.protocol || 'http')
            + '://'
            + baseUrl
            + route.pattern;
    }
}
