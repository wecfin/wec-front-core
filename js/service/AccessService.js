import {AccessStore} from './store/AccessStore';
import {IdTokenService} from './IdTokenService';
import {OpenIdGrant} from './oauth2/OpenIdGrant';

export class AccessService {
    constructor(setting, cache, apiRequest) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.idTokenService = new IdTokenService(setting, cache, apiRequest);
        this.store = new AccessStore(this.cache);
    }

    async asSetAccessToken(appCode, accessToken) {
        await this.store.asSet(appCode, accessToken);
    }

    async asGetAccessToken(appCode) {
        const cached = await this.store.asGet(appCode);
        if (cached) {
            return cached;
        }

        const idToken = await this.idTokenService.asGetCurrentIdToken();
        if (!idToken) {
            return null;
        }

        const accessToken = await this.getOpenIdGrant().asAccessToken(idToken);
        await this.asSetAccessToken(appCode, accessToken);
    }

    async asRemoveAccessToken(appCode) {
        await this.store.remove(appCode);
    }

    getOpenIdGrant() {
        this._openIdGrant = this._openIdGrant || new OpenIdGrant(this.setting.oauth2);
        return this._openIdGrant;
    }
}
