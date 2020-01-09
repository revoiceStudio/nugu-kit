const nugu = require("nugu-kit")
const express = require("express");
const app = express();
app.use(express.json());
const port = {{port}}

app.post('/answer.food',(req,res)=>{
    nugu.app(req,res); // 초기화
    console.log(nugu.getVersion());     //1.0 
    console.log(nugu.getActionName());  //FoodFighter 
    console.log(nugu.getAccessToken()); //abc123
    console.log(nugu.getSessionId());   //def456
    console.log(nugu.getIsNew());       //true
    console.log(nugu.getIsPlayBuilderRequest()); //false
    console.log(nugu.getDeviceType());  //speaker.nugu.nu200
    console.log(nugu.getDeviceState()); //null
    console.log(nugu.getAudioPlayerActivity()); //PLAYING
    console.log(nugu.getAudioToken());  //korean_token
    console.log(nugu.getAudioOffset()); //100000
    console.log(nugu.getDirectives());  //  { type: 'AudioPlayer.Play', audioItem: { stream: [Object], metadata: {} } }
    console.log(nugu.getValue("food")); // 김치
    console.log(nugu.getValueType("food")); // korean
    console.log(nugu.getValues()); // { 'food': { type: 'korean', value: '김치' }, 'price':{ type: 'won', value: '1000'} }

    /*** 기본 응답 ***/
    const food = nugu.getValue("food");
    const price = nugu.getValue("price");
    const prompt = food+"의 가격은 "+price+"원 이에요.";
    const output = {"ment":prompt};

    nugu.setOutput(output);
    nugu.response();

    /*** 예외 상황 응답 ***/
    // const food = nugu.getValue("food");
    // const foodType = nugu.getValueType("food");
    // const price = nugu.getValue("price");

    // if(foodType == "korean"){
    //     const prompt = food+"의 가격은 "+price+"원 이에요.";
    //     const output = {"food_ment":prompt};
    //     nugu.setOutput(output)
    //     nugu.response();
    // }else{
    //     nugu.setResultCode("notKorean");
    //     nugu.responseException();
    // }

    /*** AudioPlayer Interface를 사용하는 경우 응답 ***/
    // const food = nugu.getValue("food");
    // const price = nugu.getValue("price");
    // const prompt = food+"의 가격은 "+price+"원 이에요.";
    // const output = {"ment":prompt};

    // nugu.setDirectiveType("AudioPlayer.Stop")
    // nugu.setDirectiveUrl("https://www.food.kr")
    // nugu.setDirectiveToken("search_token")
    // nugu.setDirectivePreviousToken("select_token")
    // nugu.setDirectiveOffset(10000)

    // nugu.setOutput(output)
    // nugu.responseAudioPlayer()
})

app.listen(port,()=>{
    console.log("nugu-kit test sample" )
})