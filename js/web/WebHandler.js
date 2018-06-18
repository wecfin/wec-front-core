import {WecCore} from '../WecCore';

import {WebApiRequest} from './WebApiRequest';
import {WebCache} from './WebCache';
import {WebAuthObserver} from './WebAuthObserver';
import {WebRouter} from './WebRouter';
import {urlParser} from './lib/urlParser';

export class WebHandler {
    constructor(setting) {
        this.core = new WecCore(
            setting,
            new WebCache(),
            new WebApiRequest(),
            new WebAuthObserver()
        );

        this.setting = setting;
        this.auth = this.core.auth;
        this.router = new WebRouter(setting.basePath);
        this.stateCacheKey = '@web:session:state';
    }

    isLogined() {
        return this.auth.isLogined();
    }

    gotoAuth() {
        const newState = btoa(Math.random()).substr(5, 12);
        const authUrl = this.setting.oauth2.authUrl;
        const appId = this.setting.oauth2.appId;
        const targetUrl = authUrl + '?' + urlParser.queryStringify({
            state: newState,
            responseType: 'code',
            appId: appId,
            scope: 'openId',
            redirectUrl: window.location.href
        });
        window.sessionStorage.setItem(
            this.stateCacheKey,
            newState
        );
        window.location.href = targetUrl;
    }

    async accessByCode(code, state) {
        const cachedState = window.sessionStorage.getItem(
            this.stateCacheKey
        );

        if (state !== cachedState) {
            throw new Error('state not match');
        }
        return await this.core.auth.accessByCode(code);
    }

    // async
    async fetchAppSetting(appCode) {
        return this.core.appManager.fetchAppSetting(appCode);
    }

    async call(appCode, api, params) {
        return await this.core.call(appCode, api, params);
    }

    async post(appCode, api, params) {
        return await this.core.post(appCode, api, params);
    }

    async run() {
        await this.auth.getIdToken();
        this.router.refresh();
    }
}
