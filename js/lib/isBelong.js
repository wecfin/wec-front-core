export const isBelong = (child, parent) => {
    while (child.tagName && child.tagName.toUpperCase() != 'BODY') {

        if (child == parent){
            return true;
        }

        child = child.parentNode;
    }
    return false;
};
