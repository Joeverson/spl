const spider = require('crawler')

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

var artist = "U2";
var song   = "One";
jQuery.getJSON(
    "https://api.vagalume.com.br/search.php"
        + "?art=" + artist
        + "&mus=" + song,
        + "&apikey={key}"
    function (data) {
        // Letra da música
        alert(data.mus[0].text);
    }
);

//s.queue({
//    uri: 'https://www.letras.mus.br/?q=meu%20amado',
//    jQuery: false,
//    callback: function (error, res, done) {
//        if (error) {
//            console.log(error);
//        } else {
//            var $ = res.$;
//            var datas = []
//
//
//            console.log(res.body.a)
//                        
//
//        }
//        done();
//    }
//})
//
//
