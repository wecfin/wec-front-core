import {View} from 'gap-front-view';
import {oneElem} from 'gap-front-web';
import {TopbarView} from './view/TopbarView';
import {SidebarView} from './view/SidebarView';

export class CompanyLayout extends View {
    static get tag() {return 'div';}

    init () {
        this.ctn.addClass('wec-company-layout');
    }

    render() {
        this.topbar = new TopbarView(this.data);
        let opts = Object.assign(this.data, {trigger: this.topbar.getTrigger()});
        this.sidebar = new SidebarView(opts);

        this.ctn.html`
            ${this.topbar}
            ${this.sidebar}
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
}
