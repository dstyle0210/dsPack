/**
 * Yeoman Setting v0.1.1
 * @ahther 디스타일(마봉아빠 , dstyle0210@gmail.com)
 * @url : https://dstyle0210.github.io/gulp-setting/
 * @blog : http://dstyleitsme.tistory.com
 */

'use strict';

/* gulp Task API
 > gulp yeoman // workspace 기본생성(yeoman:html5 와 동일)
 > gulp yeoman:5 // workspace 기본생성 (HTML5 파일로 생성)
 > gulp yeoman:xt // workspace 기본생성 (XHTML 1.1 파일로 생성)
 > gulp // less , SASS(scss) watch 시작.
*/

import fs from "fs";
import gulp from "gulp";
import path from "path";
import gutil from "gulp-util";
import mkdirp from "mkdirp";
import request from "request";
import less from "gulp-less";
import sass from "gulp-sass";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import insert from "gulp-insert";
import folders from "gulp-folders";
import replace from "gulp-replace";
import csso from "gulp-csso";
import csscomb from "gulp-csscomb";
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
let downloadPromise = [];


/* TASK */
gulp.task("default",() => {
    run("less:build","scss:build",function(){
        console.log("CSS PreParsher Compile Success.");
        run("less","scss",function(){
            console.log("Work Space Ready.");
        });
    });
});
gulp.task("less:build",() => {
    return pipeLineLess( gulp.src([resources.less+"/**/*.less","!"+resources.less+"/_lib/*.less"]) , src.css);
});
gulp.task("scss:build",() => {
    return pipeLineScss( gulp.src([resources.scss+"/**/*.scss","!"+resources.scss+"/_lib/*.scss"]) , src.css);
});

gulp.task("less",function(){ // LESS 컴파일 watch
    var base = resources.less;
    var dest = src.css;
    var ext = "less";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
        var name = path.parse(file.path).base;
        pipeLineLess( gulp.src(file.path,{"base":base}) , dest );
        console.log(getTimeStamp() + " [less] "+name+" changed");
    });
});

gulp.task("scss",function(){ // LESS 컴파일 watch
    var base = resources.scss;
    var dest = src.css;
    var ext = "scss";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
        var name = path.parse(file.path).base;
        pipeLineLess( gulp.src(file.path,{"base":base}) , dest );
        console.log(getTimeStamp() + " [scss] "+name+" changed");
    });
});

gulp.task("yeoman",["yeoman:5"],() => { });
gulp.task("yeoman:5",["mkdir"],() => {
    request({
        url:templates+"/html5.html"
    },function(err,res,html){
        fs.writeFile(src.root+"/template.html", html, 'utf8', (err)=>{
            if(err) console.log(err);
        });
        gutil.log("Make HTML Template End.");
    });
    // 리소스 다운로드 시작.
    run("download");
});
gulp.task("yeoman:xt",["mkdir"],() => {
    request({
        url:templates+"/xhtml.html"
    },function(err,res,html){
        fs.writeFile(src.root+"/template.html", html, 'utf8', (err)=>{
            if(err) console.log(err);
        });
        gutil.log("Make HTML Template End.");
    });
    // 리소스 다운로드 시작.
    run("download");
});



/* 별도 테스크 */
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

gulp.task("download",() => {
    console.log("리소스 다운로드 시작.");
    downloadPromise.push( download("reset.css",resources.css) );
    downloadPromise.push( download("val.less",resources.less+"/_lib") );
    downloadPromise.push( download("mixin.less",resources.less+"/_lib") );
    downloadPromise.push( download("sample-less.less",resources.less+"/sample") );
    downloadPromise.push( download("val.scss",resources.scss+"/_lib") );
    downloadPromise.push( download("mixin.scss",resources.scss+"/_lib") );
    downloadPromise.push( download("sample-scss.scss",resources.scss+"/sample") );

    Promise.all(downloadPromise).then(function (values) {
        console.log("리소스 다운로드 완료.");

        setTimeout(function(){
            run("less:build","scss:build",function(){
                console.log("LESS , SCSS 컴파일 완료.");
            });
        },1000);
    });
});

// 리소스 다운로드
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



/*! Function */
function pipeLineLess(gulpFile , dest){
    return gulpFile.pipe(less())
        .pipe(csscomb("./zen.json"))
        .pipe(csso())
        .pipe(replace(/}/g,'}\n'))
        .pipe(replace('/*!','\n/*!'))
        .pipe(replace('{.','{\n\t.'))
        .pipe(replace('"UTF-8";','"UTF-8";\n'))
        .pipe(gulp.dest(dest));
};
function pipeLineScss(gulpFile , dest){
    return gulpFile.pipe(sass())
        .pipe(csscomb("./zen.json"))
        .pipe(csso())
        .pipe(replace(/}/g,'}\n'))
        .pipe(replace('/*!','\n/*!'))
        .pipe(replace('{.','{\n\t.'))
        .pipe(replace('"UTF-8";','"UTF-8";\n'))
        .pipe(gulp.dest(dest));
};
function getFolder(file){
    return path.parse( path.parse(file.path).dir ).base;
};
function getTimeStamp() {
    var now = new Date();
    return "["+(now.getHours() + ':' +((now.getMinutes() < 10)? ("0" + now.getMinutes()): (now.getMinutes())) + ':' +((now.getSeconds() < 10)? ("0" + now.getSeconds()): (now.getSeconds())))+"]";
};