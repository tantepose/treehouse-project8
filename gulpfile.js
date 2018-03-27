/*****************************************
Treehouse Fullstack Javascript Techdegree,
project #8: "Using Gulp to Build a Front End Website"
by Ole Petter Baugerød Stokke
www.olepetterstokke.no/treehouse/project8
*******************************************/

// Run 'gulp' to build site, run server and watch
// for changes in the sass – with live reload. 

'use strict';

/*****************************************
    SETUP
*****************************************/

// all modules required
var gulp = require('gulp'); //Gulp itself
var webserver = require('gulp-webserver'); //webserver with live reload
var runSequence = require('run-sequence'); //run tasks in sequence

var concat = require('gulp-concat'); //concat Javascript
var uglify = require('gulp-uglify'); //minify Javascript
var maps = require('gulp-sourcemaps'); //generating sourcemaps, both JS and CSS/sass

var sass = require('gulp-sass'); //sass to CSS
var cleanCSS = require('gulp-clean-css'); //minify css

var image = require('gulp-image'); //optimize images
var rename = require('gulp-rename'); //renaming files
var del = require('del'); //deleting files

//declaring the dist folders
var dist = {
    'content': 'dist/images',
    'styles': 'dist/css',
    'scripts': 'dist/js'
}

/*****************************************
    JAVASCRIPT
*****************************************/

// concat all Javascript-files
gulp.task('concatScripts', function () {
    return gulp.src(['js/circle/autogrow.js',
        'js/circle/circle.js',
        'js/global.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(dist.scripts));
});

// minify the concatinated Javascript
gulp.task('scripts', ['concatScripts'], function () {
    return gulp.src(dist.scripts + '/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(dist.scripts));
});

/*****************************************
    SASS
*****************************************/

// compile and concat sass-files til CSS
gulp.task('compileSass', function () {
    return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest(dist.styles));
});

// minify CSS
gulp.task('styles', ['compileSass'], function () {
    return gulp.src(dist.styles + '/global.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(dist.styles));
});

/*****************************************
    IMAGES
*****************************************/

// optimize images, copy them to dist/images
gulp.task('images', function () {
    return gulp.src('images/*') 
    .pipe(image())
    .pipe(gulp.dest(dist.content));
});

/*****************************************
    MISC FILES
*****************************************/

// delete dist folder
gulp.task('clean', function () {
    return del(['dist']);
});

// delete leftovers from minification
gulp.task('deleteJunk', function () {
    del(['dist/css/global.css', 'dist/js/all.js']);
});

// copy static files to dist folder
gulp.task('copyStatic', function () {
    return gulp.src(['index.html',
                    'icons/**'], 
                    { base: './' }) //keep folder structure
    .pipe(gulp.dest('dist'));
});

/*****************************************
    WEBSERVER
*****************************************/

// start webserver, with live reload
gulp.task('serve', function () {
    gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

// watch for changes in sass to run styles (works with live reload of server)
gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['styles']); 
});

/*****************************************
    BUILD
*****************************************/

// run all build tasks async after 'clean'
gulp.task('build', ['clean'], function () {
    gulp.start('copyStatic');
    gulp.start('scripts');
    gulp.start('styles');
    gulp.start('images');
});

// default/'gulp' - all tasks run in sequence to avoid trouble
gulp.task('default', function () {
    runSequence(
        'clean',
        ['copyStatic', 'scripts', 'styles', 'images'], //run async
        'deleteJunk',
        'serve',
        'watch');
});