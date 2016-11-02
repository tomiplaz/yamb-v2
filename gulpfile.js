var gulp = require('gulp');
var pump = require('pump');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var jsFiles = [
    'resources/assets/js/bower_components/angular/angular.js',
    'resources/assets/js/bower_components/angular-ui-router/angular-ui-router.js',
    'resources/assets/js/main.js'
];

var scssFiles = [
    'resources/assets/sass/main.scss'
];

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
        concat('app.css'),
        gulp.dest('public/css')
    ], cb);
});

gulp.task('watch', ['js', 'sass'], function() {
    gulp.watch(jsFiles, ['js']);
    gulp.watch(scssFiles, ['sass']);
});