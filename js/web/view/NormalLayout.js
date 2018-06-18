import {TopbarView} from './TopbarView';

export class NormalLayout {
    constructor(data = {}) {
        this.data = data;

        this.topbar = new TopbarView(this.data);
        this.ctn = document.createElement('div');
        this.ctn.addClass('wec-normal-layout');

        this.ctn.html`
            ${this.topbar.ctn}
            <div class="main">
                main area
            </div>
        `;
    }

    mainHtml(strs, ...items) {
        const mainArea = this.ctn.oneElem('.main');

        mainArea.html(strs, ...items);

        let frontScope = document.body.oneElem('.front-scope');
        if (!frontScope) {
            frontScope = document.createElement('div');
            frontScope.addClass('front-scope');
            document.body.appendChild(frontScope);
        }

        frontScope.html`${this.ctn}`;
    }

    setBreadcrumb(opts = []) {
        this.topbar.setBreadcrumb(opts);
    }

    renderUserInfo(userInfo = {}) {
        this.topbar.renderUserInfo(userInfo);
    }

    renderDropMenu(opts = []) {
        this.topbar.renderDropMenu(opts);
    }
}
