const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const OracleBot = require('@oracle/bots-node-sdk');
const Twit = require('twit')
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


app.listen(process.env.PORT || 3000, () => {
    console.log("Webhook is listening...");
});


webhook.on(WebhookEvent.MESSAGE_RECEIVED, recievedMessage => {
    console.log('Received a message from ODA, processing message before sending to WhatsApp. *****************>');
    console.log(recievedMessage.messagePayload.text);
    console.log(recievedMessage);

    T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
        console.log(data)
        console.log("Tweet Sent")
      })
});


var T = new Twit({
  consumer_key:         'x5LGxkuQuOe91D87MddH7V4bo',
  consumer_secret:      'QByMt9TV8gH2hi0wBpslhLVctF1lqs5RGvjfneHSEmICCjnT5n',
  access_token:         '1729027293795033089-X3Uo7ayJgEOPxfuONRoq6MSVwpVgr1',
  access_token_secret:  'i19ti5SwnOwZwv7RyHP192al1n3PoAY1Fptulqg6eZhXt',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

var stream = T.stream('statuses/filter', { track: ['#ODATwitterIntegration'] })
 
stream.on('tweet', function (tweet) {
  console.log(tweet)
  console.log(tweet.tweet)
  let user = tweet.user.screen_name
  let text = tweet.text
  let id = tweet.id_str

  const MessageModel = webhook.MessageModel();
  const message = {
    userId: user,
    messagePayload: MessageModel.textConversationMessage(text)
  }

  try {
    webhook.send(message)
  } catch (error) {
    console.log(error);   
  }
})


app.get("/", (req, res) => {
    res.status(200).send("This is webhook setup");
});