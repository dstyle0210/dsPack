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
        mkdirp("src/resources/css/less/sample");
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

        save("reset.css","src/resources/css/");
        save("val.less","src/resources/css/less/_lib");
        save("mixin.less","src/resources/css/less/_lib");
        save("sample.less","src/resources/css/less/sample");
        save("val.scss","src/resources/css/scss/_lib");
        save("mixin.scss","src/resources/css/scss/_lib");
        save("sample.scss","src/resources/css/scss/sample");
    });
});


function save(file,path){
    var url = "https://dstyle0210.github.io/dsPack/template/"+file;
    var path = path+"/"+file;
    request({
        url:url
    },function(err,res,data){
        fs.writeFile(path , data, 'utf8', (err)=>{
            if(err) console.log(err);
        });
    });
};