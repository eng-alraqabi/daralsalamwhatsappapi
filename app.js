const express = require('express');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
const app = express();
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { Client,LocalAuth} = require('whatsapp-web.js');


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});


//------API BOT COMMEND
app.post('/SendSms', async(req, res)=>{
    var num=req.body.number.toString()+'@c.us';
    var sent=await client.sendMessage(num,req.body.message);
    if(sent.ack>=0){
        res.send('Message Sent');
    }else{
        res.send('Error');
    }
});

client.on('message_ack', (msg, ack) => {
    console.log('message_ack'+msg.id.id+"/"+ack);
});
//------CHECK STATE
client.on('ready', () => {
    console.log('READY');
});
//------API BOT REPLAY
client.on('message', msg => {
    if (msg.body == 'السلام عليكم') {
        msg.reply('وعليكم السلام ورحمة الله وبركاتة');
    }else{
        msg.reply('مرحبا بكم سيتم الرد عليكم في اقرب وقت ممكن');
    }
});


client.initialize();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is listening on port "+PORT);
});
