import {AppService} from './service/AppService';
import {AccessService} from './service/AccessService';
import {IdTokenService} from './service/IdTokenService';

import {AuthCodeGrant} from './service/oauth2/AuthCodeGrant';

export class WecCore {
    constructor(setting, cache, apiRequest) {
        this.setting = setting;
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.appService = new AppService(setting, cache, apiRequest);
        this.accessService = new AccessService(setting, cache, apiRequest);
        this.idTokenService = new IdTokenService(cache);

        this.currentCompanyCode = '';
        this.currentCompany = null;
    }

    async call(appCode, api, params) {
        const url = await this.appService.asGetApiUrl(appCode, api);
        const accessToken = await this.accessService.asGetAccessToken(appCode);
        if (!accessToken) {
            throw new Error('cannot get accessToken:' + url);
        }
        return await this.apiRequest.call(accessToken, url, params);
    }

    async post(appCode, api, params) {
        const url = await this.appService.asGetApiUrl(appCode, api);
        return await this.apiRequest.postJson(url, params);
    }

    async asGetAuthUrl(opts) {
        return this.getAuthCodeGrant().asGetAuthUrl(opts);
    }

    getCurrentCompanyCode() {
        return this.currentCompanyCode;
    }

    getMainAppCode() {
        return this.setting.mainAppCode;
    }

    getCurrentAppCode() {
        return this.setting.currentAppCode;
    }

    async asEnterCompany(companyCode) {
        if (!companyCode) {
            return false;
        }
        this.currentCompanyCode = companyCode;
        this.accessService.currentCompanyCode = companyCode;

        const cached = await this.idTokenService.asGetIdToken(
            companyCode
        );

        return cached ? true : false;
    }

    async asIsLogined() {
        const accessToken = await this.accessService.asGetAccessToken(
            this.getMainAppCode()
        );
        return accessToken ? true : false;
    }

    async asAccessWec(accessToken) {
        await this.accessService.asSetAccessToken(
            this.getMainAppCode(),
            accessToken
        );
    }

    async asTokenCompany(companyCode) {
        const res = await this.call(
            this.getMainAppCode(),
            'idToken',
            {companyCode}
        );
        await this.idTokenService.asSetIdToken(companyCode, res.idToken);
    }

    async asTokenCompanyByCode(companyCode, code, state) {
        const accessToken = await this.getAuthCodeGrant().asGetAccessToken(
            code,
            state,
            {companyCode}
        );
        if (!accessToken.idToken) {
            throw new Error('cannot find idToken');
        }
        await this.idTokenService.asSetIdToken(companyCode, accessToken.idToken);
    }

    async asGetAppSetting(appCode) {
        await this.appSetting.asGetAppSetting(appCode);
    }

    async asGetCurrentCompany() {
        if (this.currentCompany) {
            return this.currentCompany;
        }

        const companyCode = this.getCurrentCompanyCode();
        if (!companyCode) {
            return null;
        }

        const cacheKey = this.getCompanyCacheKey(companyCode);
        const cachedCompany = await this.cache.get(cacheKey);
        if (cachedCompany) {
            this.currentCompany = cachedCompany;
            return cachedCompany;
        }
        
        const company = await this.call(
            this.getMainAppCode(),
            'fetchCompanyByCode',
            {companyCode: this.getCurrentCompanyCode()}
        );
        await this.cache.set(cacheKey, company);
        this.currentCompany = cachedCompany;
        return company;
    }

    async asLogout() {
        await this.cache.clear();
    }

    // ---
    getAuthCodeGrant() {
        this._authCodeGrant = this._authCodeGrant || new AuthCodeGrant(this.setting.oauth2, this.apiRequest, this.cache);
        return this._authCodeGrant;
    }

    getCompanyCacheKey(companyCode) {
        return 'company-' + companyCode;
    }

    clearCurrentCompany() {
        const cacheKey = this.getCompanyCacheKey(this.getCurrentCompanyCode());
        this.cache.remove(cacheKey);
        this.currentCompanyCode = null;
        this.currentCompany = null;
    }
}
