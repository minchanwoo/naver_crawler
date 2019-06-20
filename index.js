const express = require('express');
const cheerio = require('cheerio');
const request = require('request-promise');


const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket)=>  {
    setInterval(async()=> {
        const result = [];

        const naver_body= await request('https://www.naver.com')
        const naver_keywords =  cheerio.load(naver_body)('.PM_CL_realtimeKeyword_rolling li .ah_k');
        
        Object.values(naver_keywords).forEach((keyword)=> {
            const children = keyword.children;
            if(Array.isArray(children)) {
                const data = children[0].data;
                result.push(data)
            }
        })
        io.emit('a', {result})
    },5000)
});



server.listen('4000', ()=> {
    console.log('4000번 포트에서 대기중~!!')
})