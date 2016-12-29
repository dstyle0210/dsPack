'use strict';

/* gulp Task API
 > gulp yeoman // workspace 기본생성(yeoman:html5 와 동일)
 > gulp yeoman:5 // workspace 기본생성 (HTML5 파일로 생성)
 > gulp yeoman:xt // workspace 기본생성 (XHTML 1.1 파일로 생성)
 > gulp // less , SASS(scss) watch 시작.
*/

import fs from "fs";
import gulp from "gulp";
import gutil from "gulp-util";
import mkdirp from "mkdirp";
import request from "request";
import less from "gulp-less";
import sass from "gulp-sass";
import run from "run-sequence";

const templates = "https://dstyle0210.github.io/dsPack/template/";
const src = {
    root:"./src",
    css:"./src/css"
};
const resources = { // resources
    root:"./src/resources",
    css:"./src/resources/css",
    less:"./src/resources/less",
    scss:"./src/resources/scss"
};
let savePromise = [];


gulp.task("mkdir",() => {
    fs.mkdir(src.root,()=> {
        mkdirp(resources.css);
        mkdirp(resources.less+"/_lib");
        mkdirp(resources.less+"/sample");
        mkdirp(resources.scss+"/_lib");
        mkdirp(resources.scss+"/sample");
    });
    gutil.log("Create Resources Folder.");
});

gulp.task("less",() => {
    gulp.src([resources.less+"/**/*.less","!"+resources.less+"/_lib/*.less"])
    .pipe(less())
    .pipe(gulp.dest(src.css));
});
gulp.task("scss",() => {
    gulp.src([resources.less+"/**/*.scss","!"+resources.less+"/_lib/*.scss"])
    .pipe(sass().on("error",sass.logError))
    .pipe(gulp.dest(src.css));
});
gulp.task("yeoman",["yeoman:5"],() => {

});
gulp.task("yeoman:5",["mkdir"],() => {
    request({
        url:templates+"/html5.html"
    },function(err,res,html){
        fs.writeFile(src.root+"/template.html", html, 'utf8', (err)=>{
            if(err) console.log(err);
        });
        gutil.log("Make HTML Template End.");
    });

    savePromise.push( download("reset.css",resources.css) );
    savePromise.push( download("val.less",resources.less+"/_lib") );
    savePromise.push( download("mixin.less",resources.less+"/_lib") );
    savePromise.push( download("sample-less.less",resources.less+"/sample") );
    savePromise.push( download("val.scss",resources.scss+"/_lib") );
    savePromise.push( download("mixin.scss",resources.scss+"/_lib") );
    savePromise.push( download("sample-scss.scss",resources.scss+"/sample") );

    Promise.all(savePromise).then(function (values) {
        console.log("리소스 다운로드 완료.");
        setTimeout(function(){
            run("less","scss",function(){
                console.log("LESS , SCSS 컴파일 완료.");
            });
        },1000);
    });
});


//
function download(file,path){
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

