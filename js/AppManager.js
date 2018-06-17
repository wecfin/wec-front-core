export class AppManager {
    constructor(setting, cache, apiRequest) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;
    }

    getCacheKey(appCode) {
        return 'app:' + appCode;
    }

    async fetchApiUrl(appCode, api) {
        const appSetting = await this.fetchAppSetting(appCode);
        return this.generateUrl(appSetting, api);
    }

    async fetchAppSetting(appCode) {
        const cacheKey = this.getCacheKey(appCode);
        const cachedAppSetting = await this.cache.get(cacheKey);
        if (cachedAppSetting) {
            return cachedAppSetting;
        }

        const openSetting = this.setting.open[appCode];
        if (!openSetting) {
            throw new Error('cannot find openSetting: ' + appCode);
        }

        const homeUrl = this.generateUrl(openSetting, 'home');
        const appSetting = await this.apiRequest.postJson(homeUrl);
        if (!appSetting) {
            throw new Error('cannot find app: ' + appCode);
        }
        await this.cache.set(cacheKey, appSetting);
        return appSetting;
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
