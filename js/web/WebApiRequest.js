import {Request} from 'gap-front-request';

export class WebApiRequest {
    constructor() {
        this.request = new Request();
        this.request.addHeader('Accept', 'application/json');
    }

    getCallRequest() {
        this._callRequest = this._callRequest || new Request();
        this._callRequest.addHeader('Accept', 'application/json');
        return this._callRequest;
    }

    getPostRequest() {
        this._postRequest = this._postRequest || new Request();
        return this._postRequest;
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
