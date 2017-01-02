/**
 * Yeoman Setting v0.1.1
 * @ahther 디스타일(마봉아빠 , dstyle0210@gmail.com)
 * @url : https://dstyle0210.github.io/gulp-setting/
 * @blog : http://dstyleitsme.tistory.com
 */
/* 개발노트
- less나 scss 폴더가 없다라면, 테스크도 실행시키지 않도록 한다.
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
    scss:"./src/resources/scss",
    js:"./src/resources/js"
};
let downloadPromise = []; // 리소스 다운로드에 사용되는 Promise Array
var concatStream = false; // CSS파일 병합시, 중복실행에 따른 Stream 오류 방지용 스위치


/* TASK */
gulp.task("default",() => {
    run("less:build","scss:build",function(){
        console.log("CSS PreParsher Compile Success.");
        run("css:build",function(){
            run("less","scss",function(){
                console.log("Work Space Ready.");
                run("css",function(){});
            });
        });

    });
});
gulp.task("less:build",() => {
    return pipeLineLess( gulp.src([resources.less+"/**/*.less","!"+resources.less+"/_lib/*.less"]) , resources.css);
});
gulp.task("scss:build",() => {
    return pipeLineScss( gulp.src([resources.scss+"/**/*.scss","!"+resources.scss+"/_lib/*.scss"]) , resources.css);
});
gulp.task("css:build",folders(resources.css,function(folder){
    var base = resources.css;
    var dest = src.css;
    return gulp.src(resources.css+"/"+folder+"/*.css")
        .pipe(concat(folder+".css"))
        .pipe(replace('@charset "UTF-8";',''))
        .pipe(insert.prepend('@charset "UTF-8";\n'))
        .pipe(replace('/*!','\n/*!'))
        .pipe(replace(/[\n]{3}/g,"\n"))
        .pipe(gulp.dest(base))
        .pipe(gulp.dest(dest));
}));

gulp.task("less",function(){ // LESS 컴파일 watch
    var base = resources.less;
    var dest = resources.css;
    var ext = "less";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
        var name = path.parse(file.path).base;
        pipeLineLess( gulp.src(file.path,{"base":base}) , dest );
        console.log(getTimeStamp() + " [less] "+name+" changed");
    });
});

gulp.task("scss",function(){ // LESS 컴파일 watch
    var base = resources.scss;
    var dest = resources.css;
    var ext = "scss";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
        var name = path.parse(file.path).base;
        pipeLineScss( gulp.src(file.path,{"base":base}) , dest );
        console.log(getTimeStamp() + " [scss] "+name+" changed");
    });
});
gulp.task("css",function(){
    var base = resources.css;
    var dest = src.css;
    var ext = "css";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/*."+ext]).on("change",function(file){
        var folder = getFolder(file);
        var complate = pipeLineConcatCSS( gulp.src(base+"/"+folder+"/*."+ext) , folder+'.'+ext , base, dest);
        if(complate){
            console.log(getTimeStamp() + " [css] "+folder+".css concated");
        }else{
            console.log(getTimeStamp() + " [css] "+folder+".css concat failed");
        };
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
        mkdirp(resources.js+"/app");
        mkdirp(resources.js+"/lib");
    });
    gutil.log("Create Resources Folder.");
});

gulp.task("download",() => {
    console.log("리소스 다운로드 시작.");
    downloadPromise.push( download("zen.json","./") );
    downloadPromise.push( download("reset.css",resources.css) );
    downloadPromise.push( download("val.less",resources.less+"/_lib") );
    downloadPromise.push( download("mixin.less",resources.less+"/_lib") );
    downloadPromise.push( download("sample-less.less",resources.less+"/sample") );
    downloadPromise.push( download("val.scss",resources.scss+"/_lib") );
    downloadPromise.push( download("mixin.scss",resources.scss+"/_lib") );
    downloadPromise.push( download("sample-scss.scss",resources.scss+"/sample") );
    downloadPromise.push( download("sample-scss.scss",resources.scss+"/sample") );

    Promise.all(downloadPromise).then(function (values) {
        console.log("리소스 다운로드 완료.");

        gulp.src("./node_modules/jquery/dist/jquery.js").pipe(gulp.dest("./src/js/lib")); // jquery 최신 복사
        gulp.src("./node_modules/jquery-migrate/dist/jquery-migrate.js").pipe(gulp.dest("./src/js/lib")); // jquery 최신 호환성 migrate 복사

        setTimeout(function(){
            run("less:build","scss:build","css:build",function(){
                console.log("LESS , SCSS , CSS 컴파일 완료.");
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
        .pipe(replace('@charset "UTF-8";',''))
        .pipe(insert.prepend('@charset "UTF-8";\n'))
        .pipe(gulp.dest(dest));
};
function pipeLineScss(gulpFile , dest){
    return gulpFile.pipe(sass())
        .pipe(csscomb("./zen.json"))
        .pipe(csso())
        .pipe(replace(/}/g,'}\n'))
        .pipe(replace('/*!','\n/*!'))
        .pipe(replace('{.','{\n\t.'))
        .pipe(replace('@charset "UTF-8";',''))
        .pipe(insert.prepend('@charset "UTF-8";\n'))
        .pipe(gulp.dest(dest));
};
function pipeLineConcatCSS(gulpFiles,folderName , dest , ecmc){
    if(!concatStream){
        concatStream = true;
        var gfile = gulpFiles.pipe(concat(folderName))
            .pipe(replace('@charset "UTF-8";',''))
            .pipe(insert.prepend('@charset "UTF-8";\n'))
            .pipe(replace('/*!','\n/*!'))
            .pipe(replace(/[\n]{3}/g,"\n"))
            .pipe(gulp.dest(dest))
            .pipe(gulp.dest(ecmc)).on("end",function(){
                concatStream = false;
            });
        return gfile;
    }else{
        return false;
    };
};
function getFolder(file){
    return path.parse( path.parse(file.path).dir ).base;
};
function getTimeStamp() {
    var now = new Date();
    return "["+(now.getHours() + ':' +((now.getMinutes() < 10)? ("0" + now.getMinutes()): (now.getMinutes())) + ':' +((now.getSeconds() < 10)? ("0" + now.getSeconds()): (now.getSeconds())))+"]";
};