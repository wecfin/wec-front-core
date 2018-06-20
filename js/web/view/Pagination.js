import {View} from 'gap-front-view';

export class Pagination extends View {
    static get tag() {return 'div';}

    init() {
        this.ctn.addClass('pagination');

        let defaultOpts = {
            sizes: [10, 20, 30, 50, 100],
            layout: 'sizes, prev, next, jumper'
        };

        this.opts = Object.assign({}, defaultOpts, this.data);
        this.total = 0;
        this.pageSize = this.opts.sizes[0];
        this.totalPage = 1;
        this.current = 1;
    }

    render() {
        const opts = this.opts;
        const layout = (opts.layout).toLocaleLowerCase();
        this.ctn.html`
            ${(layout.indexOf('sizes') != -1) ? `<select name="pageSize">${opts.sizes.map(item =>  `<option value="${item}">${item}/page</option>`).join('')}</select>` : ''}
            ${(layout.indexOf('prev') != -1) ? `<button class="btn-prev">&lt;</button>` : ''}
            <ul class="pager flex">pager</ul>
            ${(layout.indexOf('next') != -1) ? `<button class="btn-next">&gt;</button>` : ''}
            ${(layout.indexOf('jumper') != -1) ?
                `<div class="jumper-wrapper">
                    <div class="flex flex-center align-center">
                        <input class="go-input" type="number" min="1" autocomplete="off">
                        <button class="go-to">go</button>
                    </div>
                </div>` : ''}
        `;
    }

    startup() {
        this.regEvent();
    }

    draw(total) {
        if (total) {
            this.total = total;
        }

        this.totalPage = Math.ceil(this.total/this.pageSize);
        this.ctn.oneElem('.go-input').setAttribute('placeholder', `${this.current}/${this.totalPage}`);

        let slot = `<li data-page="1">1</li>`;
        let diff = this.totalPage - this.current;

        if(this.totalPage > 7 && this.current < 5) {
            slot += `
                <li data-page="2">2</li>
                <li data-page="3">3</li>
                <li data-page="4">4</li>
                <li data-page="5">5</li>
                <li class="ellipsis">···</li>
                <li data-page="${this.totalPage}">${this.totalPage}</li>                
            `;
        } else if (this.totalPage > 7 && this.current >= 5) {
            slot += `
                <li class="ellipsis">···</li>
            `;

            if (diff>3) {
                slot += `    
                    <li data-page="${this.current-2}">${this.current-2}</li>
                    <li data-page="${this.current-1}">${this.current-1}</li>
                    <li data-page="${this.current}">${this.current}</li>
                    <li data-page="${this.current+1}">${this.current+1}</li>
                    <li data-page="${this.current+2}">${this.current+2}</li>
                    <li class="ellipsis">···</li>
                `;
            } else if (diff>=0) {
                slot += `
                    <li data-page="${this.totalPage-4}">${this.totalPage-4}</li>
                    <li data-page="${this.totalPage-3}">${this.totalPage-3}</li>
                    <li data-page="${this.totalPage-2}">${this.totalPage-2}</li>
                    <li data-page="${this.totalPage-1}">${this.totalPage-1}</li>
                `;
            }

            slot += `<li data-page="${this.totalPage}">${this.totalPage}</li>`;

        } else {

            for (let i = 2; i <= this.totalPage; i++) {
                slot += `<li data-page="${i}">${i}</li>`;
            }
        }

        let pager = this.ctn.oneElem('.pager');
        pager.innerHTML = slot;

        this.active();
    }

    regEvent() {
        let pager = this.ctn.oneElem('.pager');

        pager.on('click', e => {
            let ele = e.target;
            this.changePage(ele);
        });

        let pageSizeSelector = this.ctn.oneElem('[name="pageSize"]');

        pageSizeSelector.on('change', e => {
            this.changeSize(e.target.value);
        });

        let goBtn = this.ctn.oneElem('.go-to');
        let goInput = this.ctn.oneElem('.go-input');

        goBtn.on('click', () => {
            this.goTo(goInput.value);
        });

        let prevBtn = this.ctn.oneElem('.btn-prev');
        let nextBtn = this.ctn.oneElem('.btn-next');

        prevBtn.on('click', () => {
            this.prev();
        });

        nextBtn.on('click', () => {
            this.next();
        });
    }

    changePage(ele) {
        if (ele.tagName == 'LI' && !ele.hasClass('ellipsis')) {
            if (ele.hasClass('active')) {
                return;
            }

            this.current = parseInt(ele.dataset.page);   
            this.handleQueryChange();
        }
    }

    changeSize(val) {
        this.current = 1;
        this.pageSize = parseInt(val);
        this.handleQueryChange();
    }

    prev() {
        if (this.current > 1) {
            this.current = this.current - 1;
            this.handleQueryChange();
        }
    }

    next() {
        if (this.current < this.totalPage) {
            this.current = this.current +1;
            this.handleQueryChange();
        }
    }

    goTo(val) {
        if (val > 0 && val <= this.totalPage) {
            this.current = parseInt(val);
            this.handleQueryChange();
            this.ctn.oneElem('.go-input').value = '';
        }
    }

    onQueryChange(handler) {
        this.handleQueryChange = handler;
    }

    active() {
        this.deactive();

        let page = this.current ;
        let pageNumberEle = this.ctn.oneElem(`[data-page='${page}']`);
        if (pageNumberEle) {
            pageNumberEle.addClass('active');
        }
    }

    deactive() {
        let pageNumbers = this.ctn.allElem('[data-page]');
        pageNumbers.map( item => {
            item.removeClass('active');
        });
    }
}