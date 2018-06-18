import {WecCore} from '../WecCore';

import {WebApiRequest} from './WebApiRequest';
import {WebCache} from './WebCache';
import {WebAuthObserver} from './WebAuthObserver';
import {WebRouter} from './WebRouter';

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
    }

    isLogined() {
        return this.auth.isLogined();
    }

    // async

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
