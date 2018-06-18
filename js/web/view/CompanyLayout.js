import {TopbarView} from './TopbarView';
import {SidebarView} from './SidebarView';

export class CompanyLayout {
    constructor(data = {}) {
        this.data = data;

        this.topbar = new TopbarView(this.data);
        let opts = Object.assign(this.data, {trigger: this.topbar.getTrigger()});
        this.sidebar = new SidebarView(opts);

        this.ctn = document.createElement('div');
        this.ctn.addClass('wec-company-layout');

        this.ctn.html`
            ${this.topbar.ctn}
            ${this.sidebar.ctn}
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

    renderMenu(apps, handler) {
        this.sidebar.renderMenu(apps, handler);
    }

    selectSubmenu(item = '') {
        this.sidebar.selectSubmenu(item);
    }

    setRouterParams(params = {}) {
        this.sidebar.setRouterParams(params);
    }
}
