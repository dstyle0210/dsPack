'use strict';

import fs from "fs";
import gulp from "gulp";
import gutil from "gulp-util";
import mkdirp from "mkdirp";
import request from "request";

gulp.task("default",() => {

});
gulp.task("yeoman",() => {
    gutil.log("workspace setting start.");
    fs.mkdir("src",()=>{
        mkdirp("src/resources/css/less");
        mkdirp("src/resources/css/scss");
        mkdirp("src/resources/js/app");
        gutil.log("workspace setting success.");

        gutil.log("request HTML Template (https://dstyle0210.github.io/dsPack/template.html).");
        var template = '<!doctype html>\n' +
            '<html lang="ko">\n' +
            '<head>\n' +
            '\t<meta charset="UTF-8">\n\t<meta http-equiv="x-ua-compatible" content="ie=edge">\n\t<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
            '\t<title></title>\n' +
            '\t<link rel="stylesheet" href="./css/styles.css">\n' +
            '</head>\n' +
            '<body>\n\n' +
            '</body>\n' +
            '</html>';
        fs.writeFile('src/template.html', template, 'utf8', (err)=>{
            if(err) console.log(err);
        });
        gutil.log("Make HTML Template End.");
    });
});