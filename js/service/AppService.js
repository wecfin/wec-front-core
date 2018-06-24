import {AppSettingStore} from './store/AppSettingStore';

export class AppService {
    constructor(setting, cache, apiRequest) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.store = new AppSettingStore(this.cache);
    }

    async asGetApiUrl(appCode, api) {
        const appSetting = await this.asGetAppSetting(appCode);
        return this.generateUrl(appSetting, api);
    }

    async asGetAppSetting(appCode) {
        const cached = await this.store.asGet(appCode);
        if (cached) {
            return cached;
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
        await this.store.asSet(appCode, remoteAppSetting);
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
