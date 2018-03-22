'use strict';

var gulp = require('gulp'); //gulp
var concat = require('gulp-concat'); //flere filer til en
var uglify = require('gulp-uglify'); //minification
var rename = require('gulp-rename'); //renaming
var sass = require('gulp-sass'); //sass
var maps = require('gulp-sourcemaps'); //sourcemaps
var del = require('del'); //slette filer

gulp.task('concatScripts', function () {
    return gulp.src(['js/jquery.js', //få inn alle filene, rekkefølge viktig
    'js/sticky/jquery.sticky.js',
    'js/main.js'])
    .pipe(maps.init()) //lage sourcemap
    .pipe(concat('app.js')) //få som en string i en fil
    .pipe(maps.write('./')) //lagre sourcemap
    .pipe(gulp.dest('js')); //hvor lagre
});

gulp.task('minifyScripts', ['concatScripts'], function () {
    return gulp.src('js/app.js') //fordi concat først
    .pipe(uglify()) //uglify
    .pipe(rename('app.min.js')) //rename fra app.js
    .pipe(gulp.dest('js')); //lagre
});

gulp.task('compileSass', function () {
    return gulp.src('scss/application.scss') //få scss
    .pipe(maps.init()) //lage map
    .pipe(sass()) //gjøre om til css
    .pipe(maps.write('./')) //lagre map i samme mappe som css
    .pipe(gulp.dest('css')); //lagre (lager mappe om ikke der)
});

gulp.task('watchFiles', function () {
    gulp.watch('scss/**/*.scss', ['compileSass']); //se i alle mapper etter alle filer med scss
    gulp.watch('js/main.js', ['concatScripts']); //setter etter endringer i js-fila og concat
});

// gulp.task('watchSass', function () {
//     gulp.watch('scss/**/*.scss', ['compileSass']); //se i alle mapper etter alle filer med scss
// });

gulp.task('clean', function () {
    del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task('build', ['minifyScripts', 'compileSass'], function () {
    return gulp.src(['css/application.css', 'js/app.min.js', 'index.html', //hvilke filer vil ha
                    'img/**', 'fonts/**'], {base: './'}) //behold mappestrukturen
                    .pipe(gulp.dest('dist')); //kopier til dist-mappa
});

gulp.task('serve', ['watchFiles']); //amtar han KUKEN mente at man også skulle kjøre serveren her

gulp.task('default', ['clean'], function () { //clean er dependecy
    gulp.start('build'); //starter build task når clean ferdig
});