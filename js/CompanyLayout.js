import {View} from 'gap-front-view';
import {oneElem} from 'gap-front-web';
import {TopbarView} from './view/TopbarView';
import {SidebarView} from './view/SidebarView';

export class CompanyLayout extends View {
    static get tag() {return 'div';}

    init () {
        this.ctn.addClass('wec-company-layout');
        oneElem('body').appendChild(this.ctn);
    }

    render() {
        this.topbar = new TopbarView();
        this.sidebar = new SidebarView({
            trigger: this.topbar.getTrigger()
        });

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
    }

    setBreadcrumb(opts = []) {
        this.topbar.setBreadcrumb(opts);
    }

    selectMenu(conf = {}) {
        this.sidebar.selectMenu(conf);
    }
}