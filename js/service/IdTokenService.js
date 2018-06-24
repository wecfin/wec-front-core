import {IdTokenStore} from './store/IdTokenStore';

export class IdTokenService {
    constructor(cache) {
        this.cache = cache;
        this.store = new IdTokenStore(this.cache);
    }

    async asSetIdToken(companyCode, idToken) {
        await this.store.asSet(companyCode, idToken);
    }

    async asGetIdToken(companyCode) {
        return await this.store.asGet(companyCode);
    }
}
