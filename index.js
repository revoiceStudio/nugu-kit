const Directive = require('./directive');
const Response = require('./response');

module.exports = class Nugu {

    constructor(req) {
        this.authorization = req.headers.authorization.split(' ')[1];
        this.version = req.body.version;
        this.actionName = req.body.action.actionName;
        this.parameters = req.body.action.parameters;
        this.event = req.body.event;
        this.context = req.body.context;
        this.accessToken = req.body.context.session.accessToken;
        this.sessionId = req.body.context.session.id;
        this.isNew = req.body.context.session.isNew;
        this.isPlayBuilderRequest = req.body.context.session.isPlayBuilderRequest;
        this.deviceType = req.body.context.device.type;
        this.deviceState = req.body.context.device.state;
        this.response = new Response(this.version);

        if (Object.keys(req.body.context.supportedInterfaces).length !== 0) {
            this.audioPlayer = req.body.context.supportedInterfaces.AudioPlayer;
            if(this.audioPlayer){
                this.audioPlayerActivity = this.audioPlayer.playerActivity;
                this.audioToken = this.audioPlayer.token;
                this.audioOffset = this.audioPlayer.offsetInMilliseconds;
            }
        }
    }

    set output(output) {
        this.response.output = output;
    }

    set resultCode(resultCode) {
        this.response.resultCode = resultCode;
    }

    set directiveType(type) {
        this.response.directives[0].type = type;
    }

    set directiveUrl(url) {
        this.response.directives[0].audioItem.stream.url = url;
    }

    set directiveOffset(offset) {
        this.response.directives[0].audioItem.stream.offsetInMilliseconds = offset;
    }

    set directiveDelay(delay) {
        this.response.directives[0].audioItem.stream.progressReport.progressReportDelayInMilliseconds = delay;
    }

    set directiveInterval(interval) {
        this.response.directives[0].audioItem.stream.progressReport.progressReportIntervalInMilliseconds = interval;
    }

    set directiveToken(token) {
        this.response.directives[0].audioItem.stream.token = token;
    }

    set directivePreviousToken(previousToken) {
        this.response.directives[0].audioItem.stream.expectedPreviousToken = previousToken;
    }

    addDirective(){
        this.response.addDirective(new Directive());
    }

    getValue(value) {
        if (this.parameters[value] === undefined) {
            return undefined
        }
        return this.parameters[value].value;
    }

    getValueType(value) {
        if (this.parameters[value] === undefined) {
            return undefined
        }
        return this.parameters[value].type;
    }
}