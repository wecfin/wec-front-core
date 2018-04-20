import {View} from 'gap-front-view';
import {isBelong} from '../lib/isBelong';
import {fetchSidebarConfigReq} from '../req/fetchSidebarConfigReq';

export class SidebarView extends View {
    static get tag() {return 'div';}

    init() {
        this.ctn.addClass('wec-sidebar');
    }

    async render() {
        this.ctn.html`
            <div class="wec-sidebar-wrapper">
                <ul class="wec-sidebar-menu"></ul>
                <div class="wec-sidebar-tips">
                    <a href="javascript:;">
                        <i class="icon icon-setting"></i>
                        setting
                    </a>
                    <a href="javascript:;">
                        <i class="icon icon-service"></i>
                        service
                    </a>
                </div>
            </div>
        `;
    }

    startup() {
        this.regEvent();
        this.renderMenu();
    }

    async renderMenu() {
        let sidebarConf;
        try {
            sidebarConf = await fetchSidebarConfigReq();
        } catch (e) {
            throw new Error(e);
        }

        let apps = sidebarConf.apps;
        let products = sidebarConf.products;
        this.ctn.oneElem('.wec-sidebar-menu').html`
            ${apps.map(app => this.createMenuItem(app, products)).join('')}
        `;

        let menuItems = this.ctn.allElem('.wec-menu-item');
        menuItems.forEach(item => {
            item.on('click', () => item.toggleClass('menu-expanded'));
        });
    }

    createMenuItem(app, products) {
        return `
            <li class="wec-menu-item ${app.name == this.selectedMenu['app'] ? 'active menu-expanded' : ''}">
                <a class="wec-menu-title">
                    <i class="icon ${app['overView']['icon']}"></i>
                    ${app.name}
                </a>
                <ul class="wec-submenu">
                ${app.products.map(product => `
                        <li class="wec-submenu-item ${product == this.selectedMenu['product'] ? 'active' : 'no'}">
                            <a href="${products[product]['link']}">
                                ${product}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </li>
        `;
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

    selectMenu(conf = {}) {
        this.selectedMenu = conf;
    }
}