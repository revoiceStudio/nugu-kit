let nugu = {};

nugu.app = (req, res) =>{
    const data = req.body;
    this.res = res;
    this.version = data.version;
    this.actionName = data.action.actionName;
    this.parameters = data.action.parameters;
    this.accessToken = undefined;
    if(data.context.session.accessToken !== undefined){
        this.accessToken = data.context.session.accessToken;
    }
    this.sessionId = data.context.session.id;
    this.isNew = data.context.session.isNew;
    this.isPlayBuilderRequest = data.context.session.isPlayBuilderRequest;
    this.deviceType = data.context.device.type;
    this.deviceState = data.context.device.state;
    this.audioPlayerActivity = undefined;
    this.audioToken = undefined;
    this.audioOffset = undefined;
    if(data.context.supportedInterfaces){
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
    return this;
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
nugu.getVersion = ()=>{
    return this.version;
};
nugu.getActionName = ()=>{
    return this.actionName;
};
nugu.getValue = (value)=>{
    return this.parameters[value].value;
};
nugu.getValueType = (value)=>{
    return this.parameters[value].type;
};
nugu.getValues = ()=>{
    return this.parameters;
};
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