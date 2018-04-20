import {View} from 'gap-front-view';
import {oneElem} from 'gap-front-web';
import {TopbarView} from './view/TopbarView';

export class NormalLayout extends View {
    static get tag() {return 'div';}

    init () {
        this.ctn.addClass('wec-normal-layout');
        oneElem('body').appendChild(this.ctn);
    }

    render() {
        this.topbar = new TopbarView();

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
    }

    setBreadcrumb(opts = []) {
        this.topbar.setBreadcrumb(opts);
    }
}