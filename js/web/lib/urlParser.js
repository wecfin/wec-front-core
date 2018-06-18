export const urlParser = {
    getHost() {
        return location.host;
    },

    getHostname() {
        return location.hostname;
    },

    getPort() {
        return location.port;
    },

    getPathname() {
        return location.pathname;
    },

    getQuery(key, defaultVal = '') {
        let searchParams = location.search.substring(1);

        if(searchParams.charAt(searchParams.length-1) == '&') {
            searchParams = searchParams.slice(0, -1);
        }

        try {
            let re =  JSON.parse('{"' + decodeURIComponent(searchParams.replace(/&/g, '","').replace(/=/g,'":"')) + '"}');
            return re[key];
        } catch (error) {
            return defaultVal;
        }
    },

    queryStringify(obj, prefix = '') {

        const pairs = [];

        if ('string' !== typeof prefix) {
            prefix = '?';
        }

        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
            }
        }

        return pairs.length ? prefix + pairs.join('&') : '';
    }
};
