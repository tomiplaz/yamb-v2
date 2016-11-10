var gulp = require('gulp');
var pump = require('pump');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var jsDepsFiles = [
    'resources/assets/js/bower_components/angular/angular.js',
    'resources/assets/js/bower_components/angular-ui-router/release/angular-ui-router.js',
    'resources/assets/js/bower_components/lodash/dist/lodash.js',
    'resources/assets/js/bower_components/restangular/dist/restangular.js'
];

var jsFiles = [
    'resources/assets/js/src/main.js',
    'resources/assets/js/src/**/*.js'
];

var scssFiles = [
    'resources/assets/sass/main.scss'
];

var jsFilesToBuild = [
    'public/js/deps.js',
    'public/js/app.js'
];

var cssFilesToBuild = [
    'public/css/bootstrap.css',
    'public/css/main.css'
];

gulp.task('js-deps', function(cb) {
    pump([
        gulp.src(jsDepsFiles),
        concat('deps.js'),
        gulp.dest('public/js')
    ], cb);
});

gulp.task('js', function(cb) {
    pump([
        gulp.src(jsFiles),
        concat('app.js'),
        gulp.dest('public/js')
    ], cb);
});

gulp.task('sass', function(cb) {
    pump([
        gulp.src(scssFiles),
        sass(),
        concat('main.css'),
        gulp.dest('public/css')
    ], cb);
});

gulp.task('build-js', function(cb) {
    pump([
        gulp.src(jsFilesToBuild),
        concat('all.js'),
        gulp.dest('public/build')
    ], cb);
});

gulp.task('build-css', function(cb) {
    pump([
        gulp.src(cssFilesToBuild),
        concat('all.css'),
        gulp.dest('public/build')
    ], cb);
});

gulp.task('build', ['build-js', 'build-css']);

gulp.task('watch', ['js', 'sass'], function() {
    gulp.watch(jsFiles, ['js']);
    gulp.watch(scssFiles, ['sass']);
});