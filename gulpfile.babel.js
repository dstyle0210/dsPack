'use strict';

import fs from "fs";
import gulp from "gulp";
import gutil from "gulp-util";
import mkdirp from "mkdirp";
import request from "request";

const templates = {
    html5 : "https://dstyle0210.github.io/dsPack/template/html5.html",
    htmlxt: "https://dstyle0210.github.io/dsPack/template/xhtml.html"
}

gulp.task("default",() => {

});
gulp.task("yeoman:html5",() => {
    gutil.log("workspace setting start.");
    fs.mkdir("src",()=>{
        mkdirp("src/resources/css/less");
        mkdirp("src/resources/css/less/_lib");
        mkdirp("src/resources/css/scss");
        mkdirp("src/resources/css/scss/_lib");
        mkdirp("src/resources/js/app");
        gutil.log("workspace setting success.");

        request({
            url:"https://dstyle0210.github.io/dsPack/template/html5.html"
        },function(err,res,html){
            fs.writeFile('src/template.html', html, 'utf8', (err)=>{
                if(err) console.log(err);
            });
            gutil.log("Make HTML Template End.");
        });

        request({
            url:"https://dstyle0210.github.io/dsPack/template/reset.css"
        },function(err,res,reset){
            fs.writeFile('src/resources/css/reset.css', reset, 'utf8', (err)=>{
                if(err) console.log(err);
            });
            gutil.log("Make RESET CSS End.");
        });

        request({
            url:"https://dstyle0210.github.io/dsPack/template/val.scss"
        },function(err,res,scss){
            fs.writeFile('src/resources/css/scss/val.scss', scss, 'utf8', (err)=>{
                if(err) console.log(err);
        });
            gutil.log("Make SCSS Template End.");
        });

    });
});