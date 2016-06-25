var gulp = require('gulp'),
    compass = require('gulp-compass'),
    inject = require('gulp-inject'),
    bower = require('gulp-bower'),
    run = require('gulp-run'),
    bowerFiles = require('main-bower-files'),
    // es = require('event-stream'),
    // gulp = require('gulp'),
    git = require('gulp-git'),
    sass = require('gulp-ruby-sass')
    // notify = require("gulp-notify");
;

var SRC = {
    bower: 'bower_components',
    styles: 'src/styles',
    scripts: 'src/scripts',
    views: 'src/views',
    assets: 'src/assets',
    boilerplate: ['./src/.env',
        './src/index.js',
        './src/package.json',
        './src/Procfile']
};

var DEST = {
    dist:   'dist',
    bower:  'dist/public/bower_components',
    index:  'dist/views/pages/index.html',
    styles: 'dist/public/stylesheets',
    scripts:'dist/public/scripts',
    views:  'dist/views',
    assets: 'dist/public/assets'
};

/////////////////////////////////////////////
////              MAINTASKS              ////
/////////////////////////////////////////////

gulp.task('default', ['build'], function() {});


/////////////////////////////////////////////
////              SUBTASKS               ////
/////////////////////////////////////////////

gulp.task('clean', function (cb) {
    run('rm -rf '+'dist').exec();
    cb();
});

gulp.task('build', ['clean'], function() {
    gulp.src('src/views/**/*.*').pipe(gulp.dest(DEST.dist+'/views'));
    gulp.src('src/public/**/*.*').pipe(gulp.dest(DEST.dist+'/public'));
});
