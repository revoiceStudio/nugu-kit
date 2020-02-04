module.exports = class Response {
    constructor(version) {
        this.version = version;
        this.resultCode = "OK";
        this.output = {};
        this.directives = [];
    }
    
    addDirective(directive){
        this.directives.push(directive)
    }
}
