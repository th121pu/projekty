export default class Router {
    constructor(inithash) {
        window.addEventListener("hashchange", event => this.doRouting(event));
        window.location.hash = inithash;
        this.doRouting(inithash);
    }

    doRouting() {
        let hash = window.location.hash;
        if (hash) {
            hash = hash[0] === '#' ? hash.substr(1) : hash;
            if (hash === 'home') generateHomeForms();
            else {
                document.getElementById("router-view").innerHTML =
                    document.getElementById("template-" + hash).innerHTML
            }
        }
    }
}

window.router = new Router("login");