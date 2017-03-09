var gulp = require('gulp');
var pump = require('pump');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourceMaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var Server = require('karma').Server;

var jsFiles = [
    'public/src/main.js',
    'public/src/**/*.js'
];

var scssFiles = [
    'resources/assets/sass/_variables.scss',
    'resources/assets/sass/_mixins.scss',
    'resources/assets/sass/_helpers.scss',
    'resources/assets/sass/_custom.scss',
    'resources/assets/sass/main.scss'
];

/**
 * Run watch and tdd tasks.
 */
gulp.task('default', ['watch'/*, 'tdd'*/]);

/**
 * Run js and sass tasks, watch for file changes and run tasks on change.
 */
gulp.task('watch', ['js', 'sass'], function() {
    gulp.watch(jsFiles, ['js']);
    gulp.watch(scssFiles, ['sass']);
});

/**
 * Concatinate main Bower JS files.
 */
gulp.task('js-deps', function(cb) {
    pump([
        gulp.src(mainBowerFiles('**/*.js')),
        concat('deps.js'),
        gulp.dest('public/js')
    ], cb);
});

/**
 * Concatinate main Bower CSS files.
 */
gulp.task('css-deps', function(cb) {
    pump([
        gulp.src(mainBowerFiles('**/*.css')),
        concat('deps.css'),
        gulp.dest('public/css')
    ], cb);
});

/**
 * Concatinate project's JS files.
 */
gulp.task('js', function(cb) {
    pump([
        gulp.src(jsFiles),
        concat('app.js'),
        gulp.dest('public/js')
    ], cb);
});

/**
 * Compiles Sass files and concatinate the result.
 */
gulp.task('sass', function(cb) {
    pump([
        gulp.src(scssFiles),
        sass(),
        concat('app.css'),
        gulp.dest('public/css')
    ], cb);
});

/**
 * Run test once and exit.
 */
gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change.
 */
gulp.task('tdd', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});
