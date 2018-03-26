/*****************************************
Treehouse Fullstack Javascript Techdegree,
project #8: "Using Gulp to Build a Front End Website"
by Ole Petter Baugerød Stokke
www.olepetterstokke.no/treehouse/project8
******************************************/

'use strict';

/*****************************************
    SETUP
*****************************************/

// all modules required
var gulp = require('gulp'); //Gulp itself
var webserver = require('gulp-webserver'); //the webserver
var runSequence = require('run-sequence'); //run tasks in sequence

var concat = require('gulp-concat'); //concat Javascript
var uglify = require('gulp-uglify'); //minify Javascript
var maps = require('gulp-sourcemaps'); //generating sourcemaps, for both JS and sass

var sass = require('gulp-sass'); //sass to CSS
var cleanCSS = require('gulp-clean-css'); //minify css

var image = require('gulp-image'); //optimize images
var rename = require('gulp-rename'); //renaming files
var del = require('del'); //deleting files

//the dist folders
var dist = {
    'content': 'dist/images',
    'styles': 'dist/css',
    'scripts': 'dist/js'
}

/*****************************************
    JAVASCRIPT
*****************************************/

// concat all JS-files to one
gulp.task('concatScripts', function () {
    return gulp.src(['js/circle/autogrow.js', //get .js-files
        'js/circle/circle.js',
        'js/global.js'])
    .pipe(maps.init()) //make sourcemap
    .pipe(concat('all.js')) //concat them
    .pipe(maps.write('./')) //save sourcemap
    .pipe(gulp.dest(dist.scripts)) //save all.js
});

// take the concatinated all.js file and minify it
gulp.task('scripts', ['concatScripts'], function () {
    return gulp.src(dist.scripts + '/all.js') //get js
    .pipe(uglify()) //minify it
    .pipe(rename('all.min.js')) //rename it
    .pipe(gulp.dest(dist.scripts)); //save it
});

/*****************************************
    SASS
*****************************************/

//compile all sass-files to one CSS file
gulp.task('compileSass', function () {
    return gulp.src('sass/global.scss') //get sass
    .pipe(maps.init()) //make map
    .pipe(sass()) //compile sass
    .pipe(maps.write('./')) //save map
    .pipe(gulp.dest(dist.styles)); //save css
});

//minify the CSS
gulp.task('styles', ['compileSass'], function () {
    return gulp.src(dist.styles + '/global.css') //get css
    .pipe(cleanCSS({compatibility: 'ie8'})) //minify it
    .pipe(rename('all.min.css')) //rename it
    .pipe(gulp.dest(dist.styles)); //save it
});

/*****************************************
    IMAGES
*****************************************/

//optimize images
gulp.task('images', function () {
    return gulp.src('images/*') //get images
    .pipe(image()) //optimize them
    .pipe(gulp.dest(dist.content)); //save them
});

/*****************************************
    FILES
*****************************************/

//delete dist folder
gulp.task('clean', function () {
    return del(['dist']); //delete folder
});

//copy static files (index.html and icons folder)
gulp.task('copyStaticFiles', function () {
    return gulp.src([  'index.html', //files to copy
                'icons/**'], 
                { base: './' }) //keep folder structure
    .pipe(gulp.dest('dist')); //copy to dist folder
});

/*****************************************
    BUILD
*****************************************/

//build task - run all build tasks
gulp.task('build', ['clean'], function () { //clean will run first
    gulp.start('copyStaticFiles');
    gulp.start('scripts');
    gulp.start('styles');
    gulp.start('images');
});

//start webserver with live reload
gulp.task('serve', function () {
    gulp.src('dist') //start server from dist folder
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

// watch for changes in sass
gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['styles']); //run 'styles' if changes to sass files
});

//default - all tasks are run in sequence to avoid trouble
gulp.task('default', function () {
    runSequence(
        'clean',
        ['copyStaticFiles', 'scripts', 'styles', 'images'], //running async
        'serve',
        'watch');
});