import {View} from 'gap-front-view';
import {isBelong} from '../lib/isBelong';
import {fetchUserInfoReq} from '../req/fetchUserInfoReq';

export class TopbarView extends View {
    static get tag() {return 'div';}

    init() {
        this.ctn.addClass('wec-topbar');
    }

    async render() {
        this.ctn.html`
            <div class="wec-topbar-wrapper">
                <div class="wec-sidebar-trigger">
                </div>
                <div class="wec-topbar-logo">
                    <a href="/">
                        <img src="data:image/png;base64,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">
                    </a>
                </div>
                <div class="wec-breadcrumb"></div>
                <div class="wec-topbar-account">
                    <div class="avatar">
                        <img src="">
                        <span><i class="icon icon-down"></i></span>
                    </div>
                    <ul class="wec-topbar-drop">
                        <li class="drop-header">
                            Singed in as <b><span class="drop-header-nick">nick</span></b>
                        </li>
                        <li class="drop-divider"></li>
                        <li>
                            <a>修改密码</a>
                        </li>
                        <li>
                            <a>登出</a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    startup() {
        this.regEvent();
        this.renderAvatar();
    }

    async renderAvatar() {
        let userInfo;
        try {
            userInfo = await fetchUserInfoReq();
        } catch (e) {
            throw new Error (e);
        }

        this.ctn.oneElem('.avatar img').src = userInfo.avatar;
        this.ctn.oneElem('.drop-header-nick').textContent = userInfo.nick;
    }

    regEvent() {
        let dropTrigger = this.ctn.oneElem('.avatar');
        let dropMenu = this.ctn.oneElem('.wec-topbar-drop');

        dropTrigger.on('click', () => dropMenu.toggleClass('active'));

        document.documentElement.on('click', e => {
            if (isBelong(e.target, dropTrigger) || isBelong(e.target, dropMenu)) {
                return;
            }

            dropMenu.removeClass('active');
        });
    }

    setBreadcrumb(opts = []) {
        const breadcrumb = this.ctn.oneElem('.wec-breadcrumb');
        if (!opts.length) return;

        breadcrumb.html`
            ${opts.map((item, index, arr) => `<span class="breadcrumb-item ${index==(arr.length-1)?"last-piece":''}">
                            <a href="${item.href || 'javascript:;'}">${item.title}</a>
                            <i class="icon">/</i>
                        </span>
                    `)}
        `;
    }

    getTrigger() {
        this._trigger = this._trigger || this.ctn.oneElem('.wec-sidebar-trigger');
        this._trigger.html`<i class="icon icon-menu"></i>`;

        return this._trigger;
    }

    singOut() {
        //todo
    }
}