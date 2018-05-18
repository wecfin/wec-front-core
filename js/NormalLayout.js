import {View} from 'gap-front-view';
import {oneElem} from 'gap-front-web';
import {TopbarView} from './view/TopbarView';

export class NormalLayout extends View {
    static get tag() {return 'div';}

    init () {
        this.ctn.addClass('wec-normal-layout');
    }

    render() {
        this.topbar = new TopbarView(this.data);

        this.ctn.html`
            ${this.topbar}
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
