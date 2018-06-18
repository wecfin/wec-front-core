export class WebAuthObserver {
    constructor() {
        this.isLogined = false;
    }

    login() {
        this.isLogined = true;
    }

    logout() {
        this.isLogined = false;
    }
}
