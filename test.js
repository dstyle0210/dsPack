// filename : scraping.js
// author : saltfactory@gmail.com

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv  = require('iconv-lite');
iconv.skipDecodeWarning = true;

var options ={ method: "GET"
    ,uri: "http://finance.naver.com/item/main.nhn?code=000080"
    ,headers: { "User-Agent": "Mozilla/5.0" }
    ,encoding: "binary"
};
request(options, function(error, response, html){

    if (error) {console.log(error);throw error};
    var strContents = iconv.decode(html, 'euc-kr'); //decode를 안하면 한글이 깨짐
    //console.log('strContents',strContents);

    var $ = cheerio.load(strContents);
    fs.writeFile("test.html",strContents);

    var testArr = [];
    $("#tab_con1 td").each(function(item){
        var t = $(this).text().replace(/[\n\s]+/gi,"");
        $( (t).split("l") ).each(function(idx,tete){
            testArr.push(tete);
            console.log( tete );
        });
    });
    console.log(testArr);


});