'use strict';

import fs from "fs";
import gulp from "gulp";
import gutil from "gulp-util";
import mkdirp from "mkdirp";
import request from "request";
import less from "gulp-less";
import scss from "gulp-sass";

const templates = {
    html5 : "https://dstyle0210.github.io/dsPack/template/html5.html",
    htmlxt: "https://dstyle0210.github.io/dsPack/template/xhtml.html"
}
var savePromise = [];

gulp.task("default",() => {

});
gulp.task("yeoman",["yeoman:html5"],() => {

});
gulp.task("yeoman:html5",() => {
    gutil.log("workspace setting start.");
    fs.mkdir("src",()=>{
        mkdirp("src/resources/css/less");
        mkdirp("src/resources/css/less/_lib");
        mkdirp("src/resources/css/less/sample");
        mkdirp("src/resources/css/scss");
        mkdirp("src/resources/css/scss/_lib");
        mkdirp("src/resources/css/scss/sample");
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

        savePromise.push( save("reset.css","src/resources/css/") );
        savePromise.push( save("val.less","src/resources/css/less/_lib") );
        savePromise.push( save("mixin.less","src/resources/css/less/_lib") );
        savePromise.push( save("sample0.less","src/resources/css/less/sample") );
        savePromise.push( save("val.scss","src/resources/css/scss/_lib") );
        savePromise.push( save("mixin.scss","src/resources/css/scss/_lib") );
        savePromise.push( save("sample.scss","src/resources/css/scss/sample") );

        Promise.all(savePromise).then(function (values) {
            console.log("완료됨");
            setTimeout(function(){
                gulp.src(["src/resources/css/less/**/*.less","!src/resources/css/less/_lib/*.less"])
                    .pipe(less())
                    .pipe(gulp.dest("./src/resources/css"));
                gulp.src(["src/resources/css/scss/**/*.scss","!src/resources/css/scss/_lib/*.scss"])
                    .pipe(scss())
                    .pipe(gulp.dest("./src/resources/css"));
                console.log("컴파일 완료.");
            },1000);
        });
    });
});


function save(file,path){
    var url = "https://dstyle0210.github.io/dsPack/template/"+file;
    var path = path+"/"+file;
    return new Promise(function (resolve, reject) {
        request({
            url:url
        },function(err,res,data){
            fs.writeFile(path , data, 'utf8', (err)=>{
                if(err) console.log(err);
                resolve(data);
            });
        });
    });
};