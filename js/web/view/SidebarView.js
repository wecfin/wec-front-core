import {isBelong} from './fun/isBelong';

export class SidebarView {
    constructor(data) {
        this.data = data;
        this.selectedMenu = {};
        this.routerParams = {};
        this.webHandler = this.data.webHandler;

        this.ctn = document.createElement('div');
        this.ctn.addClass('wec-sidebar');

        this.ctn.html`
            <div class="wec-sidebar-wrapper">
                <ul class="wec-sidebar-menu"></ul>
            </div>
        `;
        this.regEvent();
    }

    renderMenu(apps, navItems) {
        const menuContainer = this.ctn.oneElem('.wec-sidebar-menu');
        menuContainer.html``;
        for (let key in apps) {
            const item = this.createMenuItem(apps[key], navItems);
            menuContainer.appendChild(item);
        }
    }

    createMenuItem(app, navItems) {
        let appName = app.appName;
        let isCurrentApp = this.data.currentAppCode == app.appCode;
        //let url = '//' + app.baseUrl + this.data.basePath + '/c/' + this.routerParams.companyCode + '?idToken=' + this.data.idToken || '';
        const url = this.getFrontUrl(app, this.data.basePath, this.routerParams.companyCode);

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
            this.createSubmenuItem(submenuContainer, navItems);
            li.on('click', () => li.toggleClass('menu-expanded'));
        }

        return li;
    }

    getFrontUrl(app, basePath, companyCode) {
        const localAppSetting = this.webHandler.setting.app[app.appCode];
        const frontSetting = localAppSetting && localAppSetting.site && localAppSetting.site.front;
        if (frontSetting && frontSetting.baseUrl) {
            return '//' + frontSetting.baseUrl + '/c/' + companyCode;
        }

        return '//' + app.baseUrl + basePath + '/c/' + companyCode;
    }

    createSubmenuItem(container, navItems) {
        container.html``;

        navItems.forEach(obj => {
            let li = document.createElement('li');
            li.addClass(`wec-submenu-item submenu-${obj.name} ${(obj.name === this.selectedSubmenu) ? 'active' : ''}`);
            li.html`<a href="javascript:;">${obj.name}</a>`;

            let anchor = li.oneElem('a');
            anchor.on('click', e => {
                e.stopPropagation();
                this.deActive('.wec-submenu-item');
                anchor.parentElement.addClass('active');
                this.data.router.navigate(obj.route, this.routerParams);
            });

            container.appendChild(li);
        });
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
        if (this.selectedSubmenu == item) {
            return;
        }

        this.deActive('.wec-submenu-item');
        let selected = this.ctn.oneElem(`.submenu-${item}`);
        if (selected) {
            selected.addClass('active');
        }

        this.selectedSubmenu = item;
    }

    setRouterParams(params) {
        this.routerParams = params;
    }
}
