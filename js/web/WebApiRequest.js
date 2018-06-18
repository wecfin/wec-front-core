import {Request} from 'gap-front-request';

export class WebApiRequest {
    constructor() {
        this.request = new Request();
        this.request.addHeader('Accept', 'application/json');
    }

    async call(accessToken, url, params) {
        this.request.addHeader('Authorization', 'Bearer ' + accessToken.token);
        return await this.postJson(url, params);
    }

    async postJson(url, params) {
        return await this.request.postJson(url, params);
    }
}
