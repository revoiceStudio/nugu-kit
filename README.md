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
    "version": "2.0",
    "action": {
        "actionName": "FoodFighter",
        "parameters": {
            "food": { "type": "korean", "value": "김치" },
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
            "isNew": true,
            "isPlayBuilderRequest": false
        },
        "device": {
            "type": "speaker.nugu.nu200",
            "state": null
        },
        "supportedInterfaces": {
            "AudioPlayer": {
                "playerActivity": "PLAYING",
                "token": "select_token",
                "offsetInMilliseconds": 100000
            }
        }
    }
}
```
### Request 파싱
```javascript
const Nugu = require('nugu-kit');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/answer.food',(req,res)=>{
    const nugu = new Nugu(req);

    // apikey
    console.log(nugu.authorization) // TEST-API-KEY

    // version
    console.log(nugu.version);     // 2.0 

    // action
    console.log(nugu.actionName);  // FoodFighter 
    console.log(nugu.parameters); // { 'food': { type: 'korean', value: '김치' }, 'price':{ type: 'won', value: '1000'} }

    // event
    console.log(nugu.event); // { token: 'select_token', type: 'AudioPlayer.PlaybackStarted', offset_in_milli_seconds: 2517 }}

    // session
    console.log(nugu.accessToken); // abc123
    console.log(nugu.sessionId);   // def456
    console.log(nugu.isNew);       // true
    console.log(nugu.isPlayBuilderRequest); // false

    // device
    console.log(nugu.deviceType);  // speaker.nugu.nu200
    console.log(nugu.deviceState); // null

    // supportedInterfaces
    console.log(nugu.audioPlayer) // { 'playerActivity': 'PLAYING', 'token': 'select_token', 'offsetInMilliseconds': 100000 }
    console.log(nugu.audioPlayerActivity); // PLAYING
    console.log(nugu.audioToken);  // select_token
    console.log(nugu.audioOffset); // 100000

    // response
    console.log(nugu.response);  //  { version: '2.0', resultCode: 'OK', output: {}, directives: [] }

})
```

### 특정 Utterance parameter 얻기
```javascript
console.log(nugu.parameters); // { 'food': { type: 'korean', value: '김치' }, 'price':{ type: 'won', value: '1000'} }

const food = nugu.getValue('food');          // 김치
const price = nugu.getValue('price');         // 1000
const foodType = nugu.getValueType('food');  // korean
const priceType = nugu.getValueType('price'); // won
```
### Response
#### 기본 응답 
```javascript
app.post('/answer.food',(req,res)=>{
    const nugu = new Nugu(req);
    const food = nugu.getValue('food');
    const price = nugu.getValue('price');
    const prompt = `${food}의 가격은 ${price}원 이에요`;

    nugu.output = {'ment':prompt};
    return res.json(nugu.response);
})
```
#### 기본 응답 output
```
{
    "version": "2.0",
    "resultCode": "OK",
    "output": {
      "ment": "김치의 가격은 1000원 이에요."
    },
    "directives": []
}
```

#### 예외 상황 응답
```javascript
app.post('/answer.food',(req,res)=>{
    const nugu = new Nugu(req);
    const food = nugu.getValue('food');
    const price = parseInt(nugu.getValue('price'));
    const prompt = `${food}의 가격은 ${price}원 이에요`;

    // 예외 응답
    if(price > 700){
        nugu.resultCode = 'priceExceed';
        return res.json(nugu.response);
    }

    nugu.output = {'ment':prompt};
    return res.json(nugu.response);
})
```
#### 예외 상황 응답 output
```
{
    "version": "2.0",
    "resultCode": "priceExceed",
    "output": {},
    "directives": []
}
```

#### AudioPlayer Interface를 사용하는 경우 응답
```javascript
app.post('/answer.food',(req,res)=>{
    const nugu = new Nugu(req);
    const food = nugu.getValue("food");
    const price = nugu.getValue("price");
    const prompt = `${food}의 가격은 ${price}원 이에요`;

    // default directive 추가
    nugu.addDirective(); 

    nugu.directiveType = 'AudioPlayer.Stop';
    nugu.directiveUrl = 'https://www.food.kr/stop.mp3';
    nugu.directiveOffset = 10000;
    nugu.directiveDelay = 20000;
    nugu.directiveInterval = 30000;
    nugu.directiveToken = 'search_token';
    nugu.directivePreviousToken = 'select_token';
    
    nugu.output = {'ment':prompt};
    return res.json(nugu.response);
})
```
#### AudioPlayer Interface를 사용하는 경우 응답 output
```
{
  "version": "2.0",
  "resultCode": "OK",
  "output": {
    "ment": "김치의 가격은 1000원 이에요"
  },
  "directives": [
    {
      "type": "AudioPlayer.Stop",
      "audioItem": {
        "stream": {
          "url": "https://www.food.kr/food.mp3",
          "offsetInMilliseconds": 10000,
          "progressReport": {
            "progressReportDelayInMilliseconds": 20000,
            "progressReportIntervalInMilliseconds": 30000
          },
          "token": "search_token",
          "expectedPreviousToken": "select_token"
        },
        "metadata": {}
      }
    }
  ]
}
```

#### Default directive
```javascript
nugu.addDirective();
console.log(nugu.response.directives);
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


```
## 참고 
[play builder document](https://developers-doc.nugu.co.kr/)

## 이슈
[github](https://github.com/revoiceStudio/nugu-kit/issues)

## 라이센스
Copyright (c) 2020 REVOICE:  
MIT 라이센스, [세부사항](https://github.com/revoiceStudio/nugu-kit/LICENSE.md)