# Nugu Kit for Node.js
SK텔레콤 AI 스피커 NUGU의 play를 만드는 과정에서 직접 정의한 파라미터와 [Backend proxy API Reference](https://developers-doc.nugu.co.kr/nugu-play/create-plays-with-play-builder/use-backend-proxy/backend-proxy-api-reference)에서 제공하는 규격에 맞게 HTTP Request/Response의 JSON 파싱과 응답을 손쉽게 하도록 도와줍니다. 
## 설치
아래의 명령어를 통해 nugu-kit를 설치합니다.
``` 
npm install nugu-kit
```
## 사용 방법 예시
### Request sample
```
{
    "version": "1.0",
    "action": {
        "actionName": "FoodFighter",
        "parameters": {
            "food": { "type": "koreans", "value": "김치" },
            "price": { "type": "won", "value": "1000" }
        }
    },
    "event": {
        "token": "select_token",
        "type": "AudioPlayer.PlaybackStarted",
        "offset_in_milli_seconds": 2517
    },
    "context": {
        "session": {
            "accessToken": "abc123",
            "id": "def456",
            "isNew": "true",
            "isPlayBuilderRequest": "false"
        },
        "device": {
            "type": "speaker.nugu.nu200",
            "state": null
        },
        "supportedInterfaces": {
            "AudioPlayer": {
                "playerActivity": "PLAYING",
                "token": "korean_token",
                "offsetInMilliseconds": 100000
            }
        }
    }
}
```
### Request 파싱
```javascript
const nugu = require('nugu-kit');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/answer.food',(req,res)=>{
    nugu.app(req,res); // 초기화
    console.log(nugu.getAuthorization()); // TEST-API-KEY
    console.log(nugu.getVersion());     // 1.0 
    console.log(nugu.getActionName());  // FoodFighter
    console.log(nugu.getEvent());       // { 'token': 'finish_sound', 'type': 'AudioPlayer.PlaybackFinished','offset_in_milli_seconds': 2517 }
    console.log(nugu.getContext());     // { 'session': {...}, 'device': {...}, 'supportedInterfaces': {...}  }
    console.log(nugu.getAccessToken()); // abc123
    console.log(nugu.getSessionId());   // def456
    console.log(nugu.getIsNew());       // true
    console.log(nugu.getIsPlayBuilderRequest()); // false
    console.log(nugu.getDeviceType());  // speaker.nugu.nu200
    console.log(nugu.getDeviceState()); // null
    console.log(nugu.getAudioPlayer()); // { "playerActivity": "PLAYING", "token": "korean_token", "offsetInMilliseconds": 100000 }
    console.log(nugu.getAudioPlayerActivity()); // PLAYING
    console.log(nugu.getAudioToken());  // korean_token
    console.log(nugu.getAudioOffset()); // 100000
})
```

### Utterance parameter 얻기
```javascript
app.post('/answer.food',(req,res)=>{
    nugu.app(req,res);
    const value1 = nugu.getValue("food");          // 김치
    const value2 = nugu.getValue("price");         // 1000
    const value1Type = nugu.getValueType("food");  // korean
    const value2Type = nugu.getValueType("price"); // won
    const values = nugu.getValues();               // { 'food': { type: 'korean', value: '김치' }, 'price':{ type: 'won', value: '1000'} }
})
```
### Response
#### 기본 응답 
```javascript
app.post('/answer.food',(req,res)=>{
    nugu.app(req,res);
    const food = nugu.getValue("food");
    const price = nugu.getValue("price");
    const prompt = food+"의 가격은 "+price+"원 이에요.";
    const output = {"ment":prompt};

    nugu.setOutput(output);
    nugu.response();
})
```
#### 기본 응답 output
```
{
    "version": "1.0",
    "resultCode": "OK",
    "output": {
      "ment": "김치의 가격은 1000원 이에요."
    }
}
```

#### 예외 상황 응답
```javascript
app.post('/answer.food',(req,res)=>{
    nugu.app(req,res);
    const food = nugu.getValue("food");
    const foodType = nugu.getValueType("food");
    const price = nugu.getValue("price");
    
    if(foodType == "korean"){
        const prompt = food+"의 가격은 "+price+"원 이에요.";
        const output = {"ment":prompt};
        nugu.setOutput(output)
        nugu.response();
    }else{
        nugu.setResultCode("notKorean");
        nugu.responseException();
    }
})
```
#### 예외 상황 응답 output
```
{
    "version": "1.0",
    "resultCode": "notKorean"
}
```

#### AudioPlayer Interface를 사용하는 경우 응답
```javascript
app.post('/answer.food',(req,res)=>{
    nugu.app(req,res);
    const food = nugu.getValue("food");
    const price = nugu.getValue("price");
    const prompt = food+"의 가격은 "+price+"원 이에요.";
    const output = {"ment":prompt};

    nugu.setDirectiveType("AudioPlayer.Stop");
    nugu.setDirectiveUrl("https://www.food.kr/stop.mp3");
    nugu.setDirectiveToken("search_token");
    nugu.setDirectivePreviousToken("select_token");
    nugu.setDirectiveOffset(10000);
    nugu.setDirectiveDelay(20000);
    nugu.setDirectiveInterval(30000);

    nugu.setOutput(output);
    nugu.responseAudioPlayer();
})
```
#### AudioPlayer Interface를 사용하는 경우 응답 output
```
{
    "version": "1.0",
    "resultCode": "OK",
    "output": {
      "ment": "김치의 가격은 1000원 이에요."
    },
    "directives": [
      {
        "type": "AudioPlayer.Stop",
        "audioItem": {     
            "stream": {
                "url": "https://www.food.kr/stop.mp3",
                "offsetInMilliseconds": 10000,
                "progressReport": {
                    "progressReportDelayInMilliseconds": 20000,
                    "progressReportIntervalInMilliseconds": 30000
                },
                "token": "search_token",
                "expectedPreviousToken": "select_token"
            }
        }
      }
    ]
}
```

#### Default directives
```javascript
const nugu = require('nugu-kit');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/answer.food',(req,res)=>{
    nugu.app(req,res); // 초기화
    console.log(nugu.getDirectives());
    /*** Default directive ***/
    /*   
        {
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
    */
}

```
## 참고 
[play builder document](https://developers-doc.nugu.co.kr/)

## 이슈
[github](https://github.com/revoiceStudio/nugu-kit/issues)

## 라이센스
Copyright (c) 2020 REVOICE:  
MIT 라이센스, [세부사항](https://github.com/revoiceStudio/nugu-kit/LICENSE.md)