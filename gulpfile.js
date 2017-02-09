var gulp = require('gulp');
var pump = require('pump');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');

var jsFiles = [
    'public/src/main.js',
    'public/src/**/*.js'
];

var scssFiles = [
    'resources/assets/sass/_variables.scss',
    'resources/assets/sass/_mixins.scss',
    'resources/assets/sass/_custom.scss',
    'resources/assets/sass/main.scss'
];

gulp.task('default', ['watch']);

gulp.task('watch', ['js', 'sass'], function() {
    gulp.watch(jsFiles, ['js']);
    gulp.watch(scssFiles, ['sass']);
});

gulp.task('js-deps', function(cb) {
    pump([
        gulp.src(mainBowerFiles('**/*.js')),
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

gulp.task('css-deps', function(cb) {
    pump([
        gulp.src(mainBowerFiles('**/*.css')),
        concat('deps.css'),
        gulp.dest('public/css')
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