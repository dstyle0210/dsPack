/**
 * Created by 154072 on 2016-12-29.
 */
/**
* Gulp Setting v0.1.1
* @ahther 디스타일(마봉아빠 , dstyle0210@gmail.com)
* @url : https://dstyle0210.github.io/gulp-setting/
* @blog : http://dstyleitsme.tistory.com
*/

'use strict';

var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var insert = require('gulp-insert');
var folders = require('gulp-folders');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var less = require('gulp-less');
var csso = require('gulp-csso');
var csscomb = require('gulp-csscomb');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');


// 환경설정
var src = {};
src.root = "./resource";
src.com = {};
src.com.root = src.root+"/com"; // com(EC용) 경로의 루트
src.com.css = src.com.root+"/css";
src.com.less = src.com.root+"/less"; // com(EC용) 경로의 LESS파일 폴더
src.com.scss = src.com.root+"/scss"; // com(EC용) 경로의 SCSS파일 폴더
src.com.js = src.com.root+"/js"; // com(EC용) 경로의 JS파일 폴더
src.mc_com = {};
src.mc_com.root = src.root+"/mc_com"; // mc_com(MC용) 경로의 루트
src.mc_com.css = src.root+"/mc_com/css"; // mc_com(MC용) 경로의 루트
src.mc_com.less = src.mc_com.root+"/less"; // mc_com(MC용) 경로의 LESS파일 폴더
src.mc_com.scss = src.mc_com.root+"/scss"; // mc_com(MC용) 경로의 SCSS파일 폴더
src.mc_com.js = src.mc_com.root+"/js"; // mc_com(MC용) 경로의 JS파일 폴더

var ec = {};
ec.root = "./ec_wwwroot/com";
ec.css = ec.root+"/css";
ec.js = ec.root+"/js";
ec.images = "./ec_wwwroot/images"

var mc = {};
mc.root = "./mc_wwwroot/mc_com";
mc.css = mc.root+"/css";
mc.js = mc.root+"/js";
mc.images = "./mc_wwwroot/mc_images";

var dest = {};
dest.root = "../pub_front/src/main/webapp";
dest.com = {};
dest.com.css = dest.root+"/com/css";
dest.com.js = dest.root+"/com/js";
dest.mc_com = {};
dest.mc_com.css = dest.root+"/mc_com/css";
dest.mc_com.js = dest.root+"/mc_com/js";
dest.images = dest.root+"/images";
dest.mc_images = dest.root+"/mc_images";

var CDN = {}
CDN.root = "//img.publichs.com/ECMCFO";
CDN.ec =CDN.root+"/images";
CDN.mc =CDN.root+"/mc_images";

/*! Default */
gulp.task("default",function(callback){
    runSequence("ec:less:build","mc:scss:build",function(){
        console.log("CSS PreParsher Compile Success.");
        runSequence("ec:css:build","mc:css:build",function(){
            console.log("CSS Concat Success.");
            runSequence("ec:less","ec:css","mc:scss","mc:css",function(){
                console.log("Work Space Ready.");
            });
        });
    });
});

/*! EC Task */
gulp.task("ec:less",function(){ // EC ( /com/ ) LESS 컴파일 watch
    var base = src.com.less;
    var dest = src.com.css;
    var ext = "less";
    return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
     var name = path.parse(file.path).base;
     pipeLineLess( gulp.src(file.path,{"base":base}) , dest );
     console.log(getTimeStamp() + " [ec:less] "+name+" changed");
     });
     });
     gulp.task("mc:scss",function(){ // MC ( /mc_com/ ) SASS(scss) 컴파일 watch
     var base = src.mc_com.scss;
     var dest = src.mc_com.css;
     var ext = "scss";
     return gulp.watch([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext]).on("change",function(file){
     var name = path.parse(file.path).base;
     pipeLineScss( gulp.src(file.path,{"base":base}) , dest );
     console.log(getTimeStamp() + " [mc:scss] "+name+" changed");
     });
     });
     gulp.task("ec:less:build",function(){
     var base = src.com.less;
     var dest = src.com.css;
     var ext = "less";
     return pipeLineLess( gulp.src([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext],{"base":base}) , dest );
     console.log(getTimeStamp() + " [ec:less] build");
     });
     gulp.task("mc:scss:build",function(){ // MC ( /mc_com/ ) SASS(scss) 컴파일 watch
     var base = src.mc_com.scss;
     var dest = src.mc_com.css;
     var ext = "scss";
     return pipeLineScss( gulp.src([base+"/**/*."+ext,"!"+base+"/_lib/*."+ext],{"base":base}) , dest );
     console.log(getTimeStamp() + " [mc:scss] build");
     });
     gulp.task("ec:css",function(){
     var base = src.com.css;
     var dest = ec.css;
     var ext = "css";
     return gulp.watch([base+"/**/*."+ext,"!"+base+"/*."+ext]).on("change",function(file){
     var folder = getFolder(file);
     var complate = pipeLineConcatCSS( gulp.src(base+"/"+folder+"/*."+ext) , folder+'.'+ext , base, dest);
     if(complate){
     console.log(getTimeStamp() + " [ec:css] "+folder+".css concated");
     }else{
     console.log(getTimeStamp() + " [ec:css] "+folder+".css concat failed");
     };
     });
     });
     gulp.task("mc:css",function(){
     var base = src.mc_com.css;
     var dest = mc.css;
     var ext = "css";
     return gulp.watch([base+"/**/*."+ext,"!"+base+"/*."+ext]).on("change",function(file){
     var folder = getFolder(file);
     var complate = pipeLineConcatCSS( gulp.src(base+"/"+folder+"/*."+ext) , folder+'.'+ext , base, dest);
     if(complate){
     console.log(getTimeStamp() + " [mc:css] "+folder+".css concated");
     }else{
     console.log(getTimeStamp() + " [mc:css] "+folder+".css concat failed");
     };
     });
     });
     gulp.task("ec:css:build",folders(src.com.css,function(folder){
     var base = src.com.css;
     var dest = ec.css;
     return gulp.src(src.com.css+"/"+folder+"/*.css")
     .pipe(concat(folder+".css"))
     .pipe(replace('@charset "UTF-8";',''))
     .pipe(insert.prepend('@charset "UTF-8";\n'))
     .pipe(replace('/*!','\n/*!'))
     .pipe(replace(/[\n]{3}/g,"\n"))
     .pipe(gulp.dest(base))
     .pipe(gulp.dest(dest));
     }));
     gulp.task("mc:css:build",folders(src.mc_com.css,function(folder){
     var base = src.mc_com.css;
     var dest = mc.css;
     return gulp.src(src.mc_com.css+"/"+folder+"/*.css")
     .pipe(concat(folder+".css"))
     .pipe(replace('@charset "UTF-8";',''))
     .pipe(insert.prepend('@charset "UTF-8";\n'))
     .pipe(replace('/*!','\n/*!'))
     .pipe(replace(/[\n]{3}/g,"\n"))
     .pipe(gulp.dest(base))
     .pipe(gulp.dest(dest));
     }));

     gulp.task("ec:js",function(){
     var base = src.com.js;
     var dest = ec.js;
     var ext = "js";
     return gulp.watch([base+"/**/*."+ext,"!"+base+"/*."+ext]).on("change",function(file){
     var folder = getFolder(file);
     pipeLineConcatJS( gulp.src(base+"/"+folder+"/*."+ext) , folder+'.'+ext , base, dest);
     console.log(getTimeStamp() + " [ec:js] "+folder+"."+ext+" concated");
     });
     });
     gulp.task("mc:js",function(){
     var base = src.mc_com.js;
     var dest = mc.js;
     var ext = "js";
     return gulp.watch([base+"/**/*."+ext,"!"+base+"/*."+ext]).on("change",function(file){
     var folder = getFolder(file);
     pipeLineConcatJS( gulp.src(base+"/"+folder+"/*."+ext) , folder+'.'+ext , base, dest);
     console.log(getTimeStamp() + " [mc:js] "+folder+"."+ext+" concated");
     });
     });

     gulp.task("ec:css:dist",function(){
     return gulp.src([ec.css+"/*.css","!"+ec.css+"/font.css"])
     .pipe(replace("(/images/","("+CDN.root+"/images/"))
     .pipe(gulp.dest( dest.com.css ));
     });
     gulp.task("ec:images:dist",function(){
     return gulp.src(ec.images+"/**/*.{jpg,png,gif}")
    .pipe(gulp.dest( dest.images ));
});
gulp.task("ec:js:dist",function(){
    return gulp.src(ec.js+"/EventUIClass.js")
    .pipe(gulp.dest( dest.com.js ));
});

gulp.task("mc:css:dist",function(){
    return gulp.src(mc.css+"/*.css")
         .pipe(replace("(/mc_images/","("+CDN.root+"/mc_images/"))
         .pipe(gulp.dest( dest.mc_com.css ));
         });
         gulp.task("mc:images:dist",function(){
         return gulp.src(mc.images+"/**/*.{jpg,png,gif}")
    .pipe(gulp.dest( dest.mc_images ));
});
gulp.task("mc:js:dist",function(){
    return gulp.src(mc.js+"/EventUIClass.js")
    .pipe(gulp.dest( dest.mc_com.js ));
});

// 만드는 중인 애들
gulp.task("mc:dist",function(){
    runSequence("mc:css:dist","mc:image:dist","mc:js:dist",callback);
});



gulp.task("ec:copy",function(){
    return gulp.src(ec.css+"/exhibition.css")
    .pipe(replace("(/images/","("+CDN.root+"/images/"))
    .pipe(gulp.dest( dest.com.css ));
});
gulp.task("test",function(){
    return gulp.src(src.root+"/js/aes256Admin.js")
    .pipe(uglify())
        .pipe(gulp.dest("./"));
});

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
    return gulpFile.pipe(sass().on('error', sass.logError))
        .pipe(csscomb("./zen.json"))
.pipe(csso())
        .pipe(replace(/}/g,'}\n'))
        .pipe(replace('/*!','\n/*!'))
        .pipe(replace('{.','{\n\t.'))
        .pipe(replace('"UTF-8";','"UTF-8";\n'))
        .pipe(gulp.dest(dest));
};
var concatStream = false;
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
function pipeLineConcatJS(gulpFiles,folderName , dest , ecmc){
    return gulpFiles.pipe(concat(folderName))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(dest))
        .pipe(gulp.dest(ecmc));
};

function getFolder(file){
    return path.parse( path.parse(file.path).dir ).base;
};
function getTimeStamp() {
    var now = new Date();
    return "["+(now.getHours() + ':' +((now.getMinutes() < 10)? ("0" + now.getMinutes()): (now.getMinutes())) + ':' +((now.getSeconds() < 10)? ("0" + now.getSeconds()): (now.getSeconds())))+"]";
}