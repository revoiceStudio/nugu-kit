const Nugu = require('./index')
const express = require('express');
const app = express();
app.use(express.json());
const port = 2022 /* port */

app.post('/answer.food',(req,res)=>{
    const nugu = new Nugu(req);

    // apikey
    console.log(nugu.authorization) // TEST-API-KEY

    // version
    console.log(nugu.version);     // 2.0 

    // action
    console.log(nugu.actionName);  // FoodFighter 
    console.log(nugu.parameters); // { 'food': { type: 'korean', value: '김치' }, 'price':{ type: 'won', value: '1000'} }
    console.log(nugu.getValue('food')); // 김치
    console.log(nugu.getValueType('food')); // korean

    // event
    console.log(nugu.event);

    // session
    console.log(nugu.accessToken); // abc123
    console.log(nugu.sessionId);   // def456
    console.log(nugu.isNew);       // true
    console.log(nugu.isPlayBuilderRequest); // false

    // device
    console.log(nugu.deviceType);  // speaker.nugu.nu200
    console.log(nugu.deviceState); // null

    // supportedInterfaces
    console.log(nugu.audioPlayer) // { 'playerActivity': 'PLAYING', 'token': 'korean_token', 'offsetInMilliseconds': 100000 }
    console.log(nugu.audioPlayerActivity); // PLAYING
    console.log(nugu.audioToken);  // korean_token
    console.log(nugu.audioOffset); // 100000

    // response
    console.log(nugu.response);  //  { version: '2.0', resultCode: 'OK', output: {}, directives: [] }

    
    const food = nugu.getValue('food');
    const price = parseInt(nugu.getValue('price'));
    const prompt = `${food}의 가격은 ${price}원 이에요`;
    /*
     * 기본 응답
     */

    // nugu.output = {'ment':prompt};
    // return res.json(nugu.response);

    /*
     * 예외 상황 응답
     */

    // if(price >700){
    //     nugu.resultCode = 'priceExceed';
    //     return res.json(nugu.response);
    // }

    // nugu.output = {'ment':prompt};
    // return res.json(nugu.response);
    

    /* 
     * AudioPlayer Interface를 사용하는 경우 응답
     */

    nugu.addDirective();
    console.log(nugu.response);
    nugu.directiveType = 'AudioPlayer.Stop';
    nugu.directiveUrl = 'https://www.food.kr/food.mp3';
    nugu.directiveOffset = 10000;
    nugu.directiveDelay = 20000;
    nugu.directiveInterval = 30000;
    nugu.directiveToken = 'search_token';
    nugu.directivePreviousToken = 'select_token';
    
    nugu.output = {'ment':prompt};
    return res.json(nugu.response);
})

app.listen(port,()=>{
    console.log("nugu-kit test sample" )
})