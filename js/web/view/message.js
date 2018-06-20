let instance;
let instances = [];
let seed = 1;
let zIndex=10001;
/**
 * message({type:"error", message:"something error!", duration:"3000"})
 */
export const message = opts => {
    opts = opts || {};
    const id = 'message_' + seed++;

    opts.onClose = () => message.close(id);

    instance = new Message(opts);

    instance.id = id;
    document.body.appendChild(instance.ctn);
    instance.ctn.style.zIndex = zIndex++;

    instances.push(instance);
    return instance;
};

['success', 'warning', 'info', 'error'].forEach(type => {
    message[type] = opts => {
        if (typeof opts === 'string') {
            opts = {
                msg: opts
            };
        }
        opts.type = type;
        return message(opts);
    };
});

message.close = id => {
    const len = instances.length;

    for (let i = 0; i < len; i++) {
        if (id === instances[i].id) {
            instances.splice(i, 1);
            break;
        }
    }
};

message.closeAll = () => {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
    }
};

class  Message{
    constructor(opts) {
        this.opts = opts;
        this.ctn = document.createElement('div');
        this.ctn.addClass('wec-message');
        this.type = opts.type || 'info';
        this.ctn.addClass(this.type);
        this.msg = opts.msg || 'something happend';
        this.duration = opts.duration || 3000;
        this.render();
        this.startup();
    }

    render() {
        this.ctn.html`
            <i class="message-icon icon icon-${this.type}"></i>
            <div class="message-detail">${this.msg}</div>
            <i class="icon icon-close"></i>
        `;
    }

    startup() {
        this.action();
        this.reg();
        this.startTimer();
        this.ctn.addEventListener('transitionend', () => this.close());
    }

    action(top = 0) {
        this.ctn.style.top = -80 + top + 'px';
        if (top < 112) {
            top += 10;
            setTimeout(()=> {
                this.action(top);
            },10);
        } else {
            return;
        }
    }

    reg() {
        let closeBtn = this.ctn.oneElem('.icon-close');
        closeBtn.on('click', () => {
            this.close();
        });

        this.ctn.on('mouseenter', () => this.clearTimer());
        this.ctn.on('mouseleave', () => this.startTimer());
    }

    close() {
        this.opts.onClose();
        this.ctn.remove();
    }

    clearTimer() {
        clearTimeout(this.timer);
    }

    startTimer() {
        if (this.duration > 0) {
            this.timer = setTimeout(() => {
                this.opts.onClose();
                this.ctn.addClass('fade');
            }, this.duration);
        }
    }
}