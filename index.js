'use strict';

const express = require('express')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const spider = require('crawler')


app.use(express.static('./public'));

//inicializaçao do spider crawler
let s = new spider({
    maxConnections: 10,

    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            console.log($("a").text())
        }
        done();
    }
})



// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
});



io.on('connection', function (socket) {
    console.log('a user connected: ' + socket.id);

    socket.on("event-search", (data) => {
        s.queue({
            uri: 'https://www.letras.mus.br/?q=' + data.music.replace(new RegExp(' ', 'g'), '%20'),
            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    var datas = []

                    console.log('https://www.letras.mus.br/?q=' + data.music.replace(new RegExp(' ', 'g'), '%20'))

                    console.log($("body").text())
//                    console.log($("a").length)

                    for (let i = 0; i < $("a").length; i++) {
//                        console.log($("a")[i].attribs.class)

//                        if ($("a")[i].attribs.class != undefined && $("a")[i].attribs.class == 'gs-title') {
//
//                            datas[i] = {
//                                text: $("a.gs-title")[i].text,
//                                uri: $("a.gs-title")[i].href
//                            }
//
//                        }
//
//                        console.log(datas)
                    }

                    socket.emit("event-result", {
                        data: datas
                    })
                }
                done();
            }
        })
    })

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.id);
        //        remover do array de sockets
    });
});

http.listen(3001, function () {
    console.log('Example app listening on port 3001!');
});
