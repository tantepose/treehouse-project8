'use strict';

//all the modules we need:
var gulp = require('gulp'); //Gulp itself
var concat = require('gulp-concat'); //concatinate files
var uglify = require('gulp-uglify'); //minification of Javascript
var rename = require('gulp-rename'); //renaming files
var sass = require('gulp-sass'); //sass to CSS
var maps = require('gulp-sourcemaps'); //generating sourcemaps
var del = require('del'); //deleting files

