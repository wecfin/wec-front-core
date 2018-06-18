export class WebBrowser {
    constructor(basePath = '') {
        this.basePath = basePath;
    }

    setBasePath(path) {
        this.basePath = path;
    }

    genKey() {
        return Date.now().toFixed(3);
    }

    getPath() {
        let fullpath = window.location.pathname.replace(/\/$/, '');

        if (fullpath.indexOf(this.basePath) !== 0) {
            throw new Error('Error request ' + fullpath);
        }

        return (fullpath.substr(this.basePath.length) || '/');
    }

    setPath(path) {
        window.history.pushState(
            {key: this.genKey()},
            '',
            this.basePath + path
        );
    }

    replacePath(path) {
        window.history.replaceState(
            {key: this.genKey()},
            '',
            this.basePath + path
        );
    }

    go(n) {
        window.history.go(n);
    }

    onPopstate(handle) {
        window.addEventListener('popstate', handle);
    }
}
