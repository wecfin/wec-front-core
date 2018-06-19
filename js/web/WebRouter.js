import {Router} from 'gap-front-routing';
import {WebBrowser} from './WebBrowser';

export class WebRouter {
    constructor(basePath = '/') {
        this.routes = {};
        this.router = new Router();
        this.browser = new WebBrowser();

        this.browser.setBasePath(basePath);
        this.browser.onPopstate(() => {
            this.clearRouteState();
            this.refresh();
        });
    }

    setBasePath(path) {
        this.browser.setBasePath(path);
    }

    add(pattern, name, action) {
        if (this.routes[name]) {
            throw new Error('router' + name + 'already exist');
        }
        const route = {pattern, action, name};

        this.routes[name] = route;
        this.router.add(pattern, route);

        return this;
    }

    getRoute(name, params = {}) {
        const route = this.routes[name];
        if (!route) {
            throw new Error('cannot found route ' + route);
        }
        route.params = params;
        return route;
    }

    match(path) {
        const match = this.router.match(path);

        if (!match || !match.handler) {
            throw new Error('error request ' + this.browser.getPath());
        }

        const route = match.handler;
        route.params = match.params;

        return route;
    }

    onDispatch(handle) {
        this.handleDispatch = handle;
    }

    dispatch(route) {
        this.handleDispatch(route);
    }

    transfer(name, params) {
        this.dispatch(
            this.getRoute(name, params)
        );
    }

    navigate(name, params, query) {
        if (!this.isSameRoute(name, params, query)) {
            const route = this.getRoute(name, params);
            let path = this.router.url(route.pattern, params);
            if (query) {
                path += '?' + this.buildQueryPath(query);
            }

            this.browser.setPath(path);

            this.dispatch(route);
        }
    }

    //deprecated
    redirect(...args) {
        this.navigate(...args);
    }

    refresh() {
        const route = this.match(this.browser.getPath());
        this.dispatch(route);
    }

    replace(name, params, query) {
        const route = this.getRoute(name, params);
        let path = this.router.url(route.pattern, params);
        if (query) {
            path += '?' + this.buildQueryPath(query);
        }

        this.browser.replacePath(path);
        if (name === this.preName) {
            this.go(-1);
        }

        this.updateRoute(name, params, query);
        this.dispatch(route);
    }

    buildQueryPath(query) {
        const esc = (str) => {
            return encodeURIComponent(str)
                .replace(/[!'()*]/g, escape)
                .replace(/%20/g, '+');
        };

        return Object.keys(query).map(key => {
            let val = query[key];
            val = val === true ? '1' : val;
            val = val === false ? '0' : val;
            val = val === 0 ? '0' : val;
            val = val || '';
            return esc(key) + '=' + esc(val);
        }).join('&');
    }

    updateRoute(name, params, query) {
        this.preName = this.currentName;
        this.preParams = this.currentParams;
        this.preQuery = this.currentQuery;

        this.currentName = name;
        this.currentParams = params;
        this.currentQuery = query;
    }

    isSameRoute(name, params, query) {
        if (name === this.currentName &&
            params === this.currentParams &&
            query === this.currentQuery
        ) {
            return true;
        }

        this.updateRoute(name, params, query);

        return false;
    }

    clearRouteState() {
        this.currentName = this.preName = '';
        this.currentParams = this.preParams = '';
        this.currentQuery = this.preQuery = '';
    }

    go(n) {
        this.clearRouteState();

        this.browser.go(n);
    }
}
