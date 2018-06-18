import {runOnce} from './fun/runOnce';

let target = null;

export const handler = {
    wrap: (_target) => {
        runOnce(_target => {
            if (!_target.call) {
                throw new Error('target has no function call');
            }

            target = _target;
            return;
        })(_target);
    },
    call: async (appCode, api, params) => await target.call(appCode, api, params),
    post: async (appCode, api, params) => await target.post(appCode, api, params)
};
