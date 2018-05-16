var gulp = require ('gulp');
var browserSync = require ('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var runseq = require('run-sequence');
var rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');


// Server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
        });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});


//Pug compile
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))

        .pipe(gulp.dest('build'))
});

// Styles compile
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});



//Sprite
gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('source/images/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '..images/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});


//Delete
gulp.task('clean', function del(cb) {
    return rimraf ('build', cb);
});

//Copy fonts
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));

});


//Copy images
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));

});

//Copy
gulp.task('copy', [
    'copy:fonts',
    'copy:images'
]);

//Watchers
gulp.task('watch', function(){
    gulp.watch('source/template/**/*.pug', ['templates:compile']);
    gulp.watch('source/styles/**/*.scss', ['styles:compile']);
});

//Default
gulp.task('default', function () {
        runseq(
            'clean',
            ['templates:compile', 'styles:compile', 'sprite', 'copy'],
            ['watch', 'server'])
    });