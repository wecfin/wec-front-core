export const isBelong = (child, parent) => {
    while (child && child.tagName && child.tagName.toUpperCase() != 'BODY') {

        if (child == parent){
            return true;
        }

        child = child.parentNode;
    }
    return false;
};
