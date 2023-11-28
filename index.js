const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const OracleBot = require('@oracle/bots-node-sdk');
const Twit = require('twit');

const { TwitterApi } = require("twitter-api-v2");

const { error } = require("console");
const {
    WebhookClient,
    WebhookEvent
} = OracleBot.Middleware;

const app = express().use(body_parser.json());
OracleBot.init(app);

// add webhook integration to Oracle Cloud
const webhook = new WebhookClient({
    channel: {
        url: 'https://oda-22c230bac6824685beccb24b591697be-da12.data.digitalassistant.oci.oraclecloud.com/connectors/v2/listeners/webhook/channels/d6ea2784-c7e3-4e42-a2f7-84903495a4d1',
        secret: 'i8l1GmJbt3cbPtXBVcX3ib7hfwCcXmz2'
    }
});

webhook
    .on(WebhookEvent.ERROR, err => console.log('webhook Error:', err.message))
    .on(WebhookEvent.MESSAGE_SENT, message => console.log('Message to chatbot:', message));
app.post('/bot/message', webhook.receiver()); // receive bot messages


app.listen(3000, () => {
    console.log("Webhook is listening...");
});


webhook.on(WebhookEvent.MESSAGE_RECEIVED, recievedMessage => {
    console.log('Received a message from ODA, processing message before sending to WhatsApp. *****************>');
    console.log(recievedMessage.messagePayload.text);
    console.log(recievedMessage);

    // T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    //     console.log(data)
    //     console.log("Tweet Sent")
    //   })
});


// var T = new Twit({
//     consumer_key: "cp3dD2nxMzmt8WmzYD8LycG0H",
//     consumer_secret: "0CQuw4o52Fi9ayejEYG9BcX1w3Pof8QGxnlwGGTnkopTisVLUd",
//     access_token: "1729027293795033089-kSdl2L9QCoh78J3g2vASqUoXTNCREv",
//     access_token_secret: "pfK6vgiVdoJsAfpyUv64iOiWodtma0j3LE8HFj6pAgRtm",
// //   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL: false     // optional - requires SSL certificates to be valid.
// })

// let stream = T.stream('statuses/filter', { track: '#ODATwitterIntegration' })
// // 1729103096067096576Amarnatdp

// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//     console.log(data)
//     // console.log(response);
//     console.log(err);
//   })

//   var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })
 
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })
 
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
//   console.log(tweet.tweet)
//   let user = tweet.user.screen_name
//   let text = tweet.text
//   let id = tweet.id_str

//   const MessageModel = webhook.MessageModel();
//   const message = {
//     userId: user,
//     messagePayload: MessageModel.textConversationMessage(text)
//   }

//   webhook.send(message)
// //   .then(()=>{
// //     console.log("Messahe Sent")
// //   }, e => console.log("error message" + e.message))

// //   try {
// //     webhook.send(message)
// //   } catch (error) {
// //     console.log(error);   
// //   }
// })

const client = new TwitterApi({
    appKey: "cp3dD2nxMzmt8WmzYD8LycG0H",
    appSecret: "0CQuw4o52Fi9ayejEYG9BcX1w3Pof8QGxnlwGGTnkopTisVLUd",
    accessToken: "1729027293795033089-kSdl2L9QCoh78J3g2vASqUoXTNCREv",
    accessSecret: "pfK6vgiVdoJsAfpyUv64iOiWodtma0j3LE8HFj6pAgRtm"
})

const rwClient = client.readWrite
const tweet = async () => {
    try {
        const user = await rwClient.v2.userByUsername('Amarnatdp');
        console.log(user);
        // await rwClient.v2.tweet("Hello Twitter, this is new ODA Integration test")
    } catch (error) {
        console.log("Error...");    
    }
}

tweet();




app.get("/", (req, res) => {
    res.status(200).send("This is webhook setup");
});
