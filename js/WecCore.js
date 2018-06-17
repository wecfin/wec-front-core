import {Auth} from './Auth';
import {AppManager} from './AppManager';

export class WecCore {
    constructor(setting, cache, apiRequest, authObserver) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.appManager = new AppManager(cache, apiRequest);

        this.auth = new Auth(setting, this.appManager, cache, apiRequest);
        this.auth.attach(authObserver);
    }

    async call(appCode, api, params) {
        const url = await this.appManager.fetchApiUrl(appCode,api);
        const accessToken = await this.auth.fetchAccessToken(appCode);
        return await this.apiRequest.call(accessToken, url, params);
    }
}
