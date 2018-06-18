import {Auth} from './Auth';
import {AppManager} from './AppManager';

export class WecCore {
    constructor(setting, cache, apiRequest, authObserver) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.appManager = new AppManager(setting, cache, apiRequest);

        this.auth = new Auth(setting, cache, apiRequest, this.appManager);
        this.auth.attach(authObserver);
    }

    async call(appCode, api, params) {
        const url = await this.appManager.fetchApiUrl(appCode,api);
        const accessToken = await this.auth.fetchAccessToken(appCode);
        return await this.apiRequest.call(accessToken, url, params);
    }

    async post(appCode, api, params) {
        const url = await this.appManager.fetchApiUrl(appCode,api);
        return await this.apiRequest.postJson(url, params);
    }
}
