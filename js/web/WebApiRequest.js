import {Request} from 'gap-front-request';

export class WebApiRequest {
    constructor() {
        this.request = new Request();
        this.request.addHeader('Accept', 'application/json');
    }

    getCallRequest() {
        const request = new Request();
        request.addHeader('Accept', 'application/json');
        request.withCredentials = true;
        return request;
    }

    getPostRequest() {
        const request  = new Request();
        request.withCredentials = true;
        return request;
    }

    async call(accessToken, url, params) {
        const request = this.getCallRequest();
        request.addHeader('Authorization', 'Bearer ' + accessToken.token);
        return await request.postJson(url, params);
    }

    async postJson(url, params) {
        return await this.getPostRequest().postJson(url, params);
    }
}
