export const runOnce = (fun) => {
    return (...args) => {
        if (fun) {
            const result = fun(...args);
            fun = null;
            return result;
        }
    };
};
