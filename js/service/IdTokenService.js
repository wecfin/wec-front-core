import {IdTokenStore} from './store/IdTokenStore';

export class IdTokenService {
    constructor(cache) {
        this.cache = cache;
        this.currentCompanyCode = '';
        this.store = new IdTokenStore(this.cache);
    }

    async asSetIdToken(companyCode, idToken) {
        await this.store.asSet(companyCode, idToken);
        this.currentCompany = companyCode;
    }

    async asGetCurrentIdToken() {
        if (!this.currentCompanyCode) {
            return null;
        }
        return await this.asGetIdToken(this.currentCompanyCode);
    }

    async asGetIdToken(companyCode) {
        return await this.store.asGet(companyCode);
    }
}
