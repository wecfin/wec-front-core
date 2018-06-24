export class AuthCodeGrant {
    constructor(opts, apiRequest, cache) {
        this.cache = cache;
        this.apiRequest = apiRequest;

        this.appId = opts.appId;
        this.authUrl = opts.authUrl;
        this.accessUrl = opts.accessUrl;
        this.redirectUrl = opts.redirectUrl;

        this.stateCacheKey = 'state';
    }

    async asGetAuthUrl(opts) {
        const state = btoa(Math.random()).substr(5, 12);
        const targetUrl = this.authUrl + '?' + this.queryStringify({
            state: state,
            responseType: 'code',
            appId: this.appId,
            scope: 'openId',
            redirectUrl: opts.redirectUrl || this.redirectUrl
        });

        await this.cache.set(this.stateCacheKey, state);
        return targetUrl;
    }

    async asAssertState(state) {
        const cachedState = await this.cache.get(this.stateCacheKey);
        if (state !== cachedState) {
            throw new Error('state not match');
        }
    }

    async asGetAccessToken(code, state, extra) {
        await this.asAssertState(state);
        const params = Object.assign({
            appId: this.appId,
            grantType: 'authCode',
            code: code,
        }, extra);
        return await this.apiRequest.postJson(this.accessUrl, params);
    }

    queryStringify(params) {
        return Object.keys(params).map(key => {
            return encodeURIComponent(key)
                + '='
                + encodeURIComponent(params[key]);
        }).join('&');
    }
}
