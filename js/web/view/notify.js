let instance;
let instances = [];
let seed = 1;
let zIndex=10001;
/**
 * notify({type:"error", message:"something error!", duration:"3000"})
 */
export const notify = options => {
    options = options || {};
    const id = 'notification_' + seed++;

    options.onClose = () => notify.close(id);

    instance = new Notification(options);

    instance.id = id;
    document.body.appendChild(instance.ctn);
    instance.ctn.style.zIndex = zIndex++;

    let verticalOffset = options.offset || 0;
    instances.forEach(item => {
        verticalOffset += item.ctn.offsetHeight + 16;
    });
    verticalOffset += 16;
    instance.ctn.style.top = verticalOffset + 'px';
    instances.push(instance);
    return instance;
};

['success', 'warning', 'info', 'error'].forEach(type => {
    notify[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        options.type = type;
        return notify(options);
    };
});

notify.close = id => {
    let index = -1;
    const len = instances.length;
    const instance = instances.filter((instance, i) => {
        if (instance.id === id) {
            index = i;
            return true;
        }
        return false;
    })[0];

    if (!instance) return;
    instances.splice(index, 1);

    if (len <= 1) return;
    const removedHeight = instance.ctn.offsetHeight;

    for (let i = index; i < len - 1 ; i++) {
        instances[i].ctn.style.top = parseInt(instances[i].ctn.style.top, 10) - removedHeight - 16 + 'px';
    }
};

notify.closeAll = () => {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
    }
};

class  Notification{
    constructor(opts) {
        this.opts = opts;
        this.ctn = document.createElement('div');
        this.ctn.addClass('wec-notification');
        this.type = opts.type || 'info';
        this.ctn.addClass(this.type);
        this.message = opts.message || 'enh , be careful about what you doing';
        this.duration = opts.duration || 3000;
        this.render();
        this.reg();
        this.startup();
        this.startTimer();
    }

    render() {
        this.ctn.html`
            <i class="notification-icon icon icon-${this.type}"></i>
            <div class="notification-group">
                <div class="notification-title"><b>${this.type}</b></div>
                <div class="notification-message">${this.message}</div>
            </div>
            <i class="icon icon-close"></i>
        `;
    }

    startup() {
        this.action();
    }

    action(right = 0) {
        this.ctn.style.right = -320+right+'px';
        if (right < 336) {
            right += 21;
            setTimeout(()=> {
                this.action(right);
            },10);
        } else {
            return;
        }
    }

    reg() {
        let closeBtn = this.ctn.oneElem('.icon-close');
        closeBtn.on('click', () => {
            this.opts.onClose();
            this.ctn.remove();
        });
    }

    startTimer() {
        if (this.duration > 0) {
            this.timer = setTimeout(() => {
                this.opts.onClose();
                this.ctn.remove();
            }, this.duration);
        }
    }
}