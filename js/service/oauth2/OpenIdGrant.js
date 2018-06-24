export class OpenIdGrant {
    constructor(opts, apiRequest) {
        this.appId = opts.appId;
        this.accessUrl = opts.accessUrl;
        this.apiRequest = apiRequest;
    }

    async asAccessToken(idToken) {
        return await this.apiRequest.postJson(
            this.accessUrl,
            {
                appId: this.appId,
                grantType: 'openId',
                idToken: idToken
            }
        );
    }
}
