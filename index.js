let nugu = {};

nugu.app = (req, res) =>{
    const data = req.body;
    this.res = res;
    this.authorization = req.headers.authorization.split(" ")[1];
    this.version = data.version;
    this.actionName = data.action.actionName;
    this.parameters = data.action.parameters;
    this.event = data.event;
    this.context = data.context;
    this.accessToken = undefined;
    if(data.context.session.accessToken !== undefined){
        this.accessToken = data.context.session.accessToken;
    }
    this.sessionId = data.context.session.id;
    this.isNew = data.context.session.isNew;
    this.isPlayBuilderRequest = data.context.session.isPlayBuilderRequest;
    this.deviceType = data.context.device.type;
    this.deviceState = data.context.device.state;
    this.audioPlayer = undefined;
    this.audioPlayerActivity = undefined;
    this.audioToken = undefined;
    this.audioOffset = undefined;
    if(Object.keys(data.context.supportedInterfaces).length !== 0){
        this.audioPlayer = data.context.supportedInterfaces.AudioPlayer;
        this.audioPlayerActivity = data.context.supportedInterfaces.AudioPlayer.playerActivity;
        this.audioToken = data.context.supportedInterfaces.AudioPlayer.token;
        this.audioOffset = data.context.supportedInterfaces.AudioPlayer.offsetInMilliseconds;
        this.directives = {
            "type":"AudioPlayer.Play",
            "audioItem":{
                "stream":{
                    "url": "",
                    "offsetInMilliseconds":0,
                    "progressReport":{
                        "progressReportDelayInMilliseconds": 0,
                        "progressReportIntervalInMilliseconds": 0
                    },
                    "token":"",
                    "expectedPreviousToken":""
                },
                "metadata":{}
            }
        }
    }
};
nugu.response = ()=>{
    let result = {};
    result.version = this.version;
    result.resultCode = "OK";
    result.output = this.output;
    return this.res.json(result);
};
nugu.responseException = ()=>{
    let result = {};
    result.version = this.version;
    result.resultCode = this.resultCode;
    return this.res.json(result);
};
nugu.responseAudioPlayer = ()=>{
    let result = {};
    result.version = this.version;
    result.resultCode = "OK";
    result.output = this.output;
    result.directives = this.directives;
    return this.res.json(result);
};
/* 
 * get directive
 */
nugu.getDirectives = ()=>{
    return this.directives;
}
/* 
 * set directive
 */
nugu.setOutput = (output)=>{
    this.output = output;
}
nugu.setResultCode = (resultCode)=>{
    this.resultCode = resultCode;
}
nugu.setDirectiveType = (type)=>{
    this.directives.type = type;
}
nugu.setDirectiveUrl = (url)=>{
    this.directives.audioItem.stream.url = url;
}
nugu.setDirectiveOffset = (offset)=>{
    this.directives.audioItem.stream.offsetInMilliseconds = offset;
}
nugu.setDirectiveDelay = (delay)=>{
    this.directives.audioItem.stream.progressReportDelayInMilliseconds = delay;
}
nugu.setDirectiveInterval = (interval)=>{
    this.directives.audioItem.stream.progressReportIntervalInMilliseconds = interval;
}
nugu.setDirectiveToken = (token)=>{
    this.directives.audioItem.stream.token = token;
}
nugu.setDirectivePreviousToken = (previousToken)=>{
    this.directives.audioItem.stream.expectedPreviousToken = previousToken;
}
/* 
 * get request JSON
 */
nugu.getAuthorization = ()=>{
    return this.authorization;
}
nugu.getVersion = ()=>{
    return this.version;
};
nugu.getActionName = ()=>{
    return this.actionName;
};
nugu.getEvent = ()=>{
    return this.event;
}
nugu.getContext = ()=>{
    return this.context;
}
nugu.getValue = (value)=>{
    if(this.parameters[value] === undefined){
        return undefined
    }
    return this.parameters[value].value;
};
nugu.getValueType = (value)=>{
    if(this.parameters[value] === undefined){
        return undefined
    }
    return this.parameters[value].type;
};
nugu.getValues = ()=>{
    return this.parameters;
};
nugu.getAudioPlayer = ()=>{
    return this.audioPlayer;
}
nugu.getAccessToken = ()=>{
    return this.accessToken;
};
nugu.getSessionId = ()=>{
    return this.sessionId;
}
nugu.getIsNew = ()=>{
    return this.isNew;
}
nugu.getIsPlayBuilderRequest = ()=>{
    return this.isPlayBuilderRequest;
}
nugu.getDeviceType = ()=>{
    return this.deviceType;
};
nugu.getDeviceState = ()=>{
    return this.deviceState;
};
nugu.getAudioPlayerActivity = ()=>{
    return this.audioPlayerActivity;
};
nugu.getAudioToken = ()=>{
    return this.audioToken;
};
nugu.getAudioOffset = ()=>{
    return this.audioOffset;
};

module.exports = nugu;