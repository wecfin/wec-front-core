import {View} from 'gap-front-view';
import {isBelong} from '../lib/isBelong';

export class SidebarView extends View {
    static get tag() {return 'div';}

    init() {
        this.ctn.addClass('wec-sidebar');
        this.selectedMenu = {};
    }

    render() {
        this.ctn.html`
            <div class="wec-sidebar-wrapper">
                <ul class="wec-sidebar-menu"></ul>
            </div>
        `;
    }

    startup() {
        this.regEvent();
    }

    renderMenu(apps, handler) {
        const menuContainer = this.ctn.oneElem('.wec-sidebar-menu');
        menuContainer.html``;
        for (let key in apps) {
            let item = this.createMenuItem(apps[key], handler);
            menuContainer.appendChild(item);
        }
    }

    createMenuItem(app, handler) {
        let appName = app.appName;
        let isCurrentApp = this.data.currentAppCode == app.appCode;
        let url = '//' + app.baseUrl + this.data.basePath;
        let li = document.createElement('li');
        li.addClass(`wec-menu-item ${isCurrentApp ? 'active menu-expanded' : ''}`);
        li.html`
            <a class="wec-menu-title" href=${isCurrentApp? 'javascript:;' : url}>
                <i class="icon icon-${appName}"></i>
                ${appName}
            </a>
            <ul class="wec-submenu"></ul>
        `;
        if (isCurrentApp) {
            let submenuContainer = li.oneElem('ul');
            this.createSubmenuItem(submenuContainer, handler);
            li.on('click', e => li.toggleClass('menu-expanded'));
        }

        return li;
    }

    async createSubmenuItem(container, handler) {
        container.html``;
        try {
            let submenuObjs = await handler();
            submenuObjs.forEach(obj => {
                let li = document.createElement('li');
                li.addClass(`wec-submenu-item submenu-${obj.name} ${(obj.name === this.selectedSubmenu) ? 'active' : ''}`);
                li.html`<a href="javascript:;">${obj.name}</a>`;

                let anchor = li.oneElem('a');
                anchor.on('click', e => {
                    e.stopPropagation();
                    this.deActive('.wec-submenu-item');
                    anchor.parentElement.addClass('active');
                    this.data.router.redirect(obj.route);
                })

                container.appendChild(li);
            })
        } catch (e) {
            throw new Error(e);
        }
    }

    deActive(selector) {
        let eles = this.ctn.allElem(selector);
        if (!eles) return;

        eles.forEach(ele => ele.removeClass('active'));
    }

    regEvent() {
        let trigger = this.data.trigger;
        if (trigger) {
            trigger.on('click', () => this.ctn.toggleClass('active'));
        }

        document.documentElement.on('click', e => {
            if (isBelong(e.target, this.ctn) || isBelong(e.target, trigger)) {
                return;
            }

            this.ctn.removeClass('active');
        });
    }

    selectSubmenu(item) {
        let selected = this.ctn.oneElem(`.submenu-${item}`);
        if (selected) {
            this.deActive('.wec-submenu-item');
            selected.addClass('active');
            return;
        }

        this.selectedSubmenu = item;
    }
}
