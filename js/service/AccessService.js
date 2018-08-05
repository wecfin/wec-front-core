import {AccessStore} from './store/AccessStore';
import {IdTokenService} from './IdTokenService';
import {OpenIdGrant} from './oauth2/OpenIdGrant';

export class AccessService {
    constructor(setting, cache, apiRequest) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.idTokenService = new IdTokenService(cache);
        this.store = new AccessStore(this.cache);
        this.currentCompanyCode = '';
    }

    async asSetAccessToken(appCode, accessToken) {
        if (this.currentCompanyCode) {
            await this.store.asSet(`${appCode}-` + this.currentCompanyCode, accessToken);
            return;
        }

        await this.store.asSet(appCode, accessToken);
    }

    async asGetAccessToken(appCode) {
        let cached = await this.store.asGet(appCode);
        if (cached) {
            return cached;
        }

        if (!this.currentCompanyCode) {
            return null;
            //return new Error('no companyCode');
        }

        cached = await this.store.asGet(`${appCode}-` + this.currentCompanyCode);
        if (cached) {
            return cached;
        }

        const idToken = await this.idTokenService.asGetIdToken(this.currentCompanyCode);
        if (!idToken) {
            return null;
            //throw new Error('cannot get current idToken');
        }

        const accessToken = await this.getOpenIdGrant().asAccessToken(idToken);
        await this.asSetAccessToken(appCode, accessToken);
        return accessToken;
    }

    async asRemoveAccessToken(appCode) {
        await this.store.remove(appCode);
    }

    getOpenIdGrant() {
        this._openIdGrant = this._openIdGrant || new OpenIdGrant(this.setting.oauth2, this.apiRequest);
        return this._openIdGrant;
    }
}
