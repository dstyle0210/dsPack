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
        request({
            url:"https://dstyle0210.github.io/dsPack/template/html5.html"
        },function(err,res,html){
            fs.writeFile('src/template.html', html, 'utf8', (err)=>{
                if(err) console.log(err);
            });
            gutil.log("Make HTML Template End.");
        });
    });
});