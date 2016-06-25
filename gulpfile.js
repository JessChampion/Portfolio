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

gulp.task('dev', ['build', 'serve'], function() {});

gulp.task('deploy', ['heroku'], function() {});

/////////////////////////////////////////////
////              SUBTASKS               ////
/////////////////////////////////////////////

gulp.task('clean', function (cb) {
    run('rm -rf '+'dist').exec();
    cb();
});

//----------sync-group-bower----------//

gulp.task('bower:lib', ['clean'], function() {
    //run bower install
    return bower()
        .pipe(gulp.dest(SRC.bower))
});

gulp.task('bower:include', ['bower:lib'], function() {
    //copy files to dist
    return gulp.src(SRC.bower + '/**/*.*')
        .pipe(gulp.dest(DEST.bower))
});


gulp.task('bower', ['bower:lib','bower:include'], function(cb) {
    cb();
});

//----------sync-group-src----------//

gulp.task('compass', ['bower'], function() {
    return gulp.src(SRC.styles + '/*.scss')
        .pipe(compass({
            css: DEST.styles,
            sass: SRC.styles
        }))
        .pipe(gulp.dest(DEST.styles));
});

gulp.task('js', ['bower'], function () {
    return gulp.src(SRC.scripts + '/**/*.js')
        .pipe(gulp.dest(DEST.scripts));
});

gulp.task('html', ['bower'], function () {
    return gulp.src(SRC.views+'/**/*.*')
        .pipe(gulp.dest(DEST.views));
});

gulp.task('assets', ['bower'], function () {
    return gulp.src(SRC.assets+'/**/*.*')
        .pipe(gulp.dest(DEST.assets));
});

gulp.task('compile', ['bower','compass','js', 'html', 'assets'], function(cb) {
    cb();
});


//----------sync-group-src----------//

// gulp.task('src', ['bower'], function() {
//     gulp.src('src/views/**/*.*').pipe(gulp.dest(DEST.dist+'/views'));
//     gulp.src('src/assets/**/*.*').pipe(gulp.dest(DEST.dist+'/public/assets'));
//     gulp.src('src/scripts/**/*.*').pipe(gulp.dest(DEST.dist+'/public/scripts'));
// });



//----------sync-inject----------//
gulp.task('inject', ['compile'], function() {
    return gulp.src('./dist/views/pages/index.html')
        .pipe(inject(gulp.src(bowerFiles(
            {
                overrides: {
                    bootstrap: {
                        main: [
                            './dist/js/bootstrap.js',
                            './dist/css/*.min.*',
                            './dist/fonts/*.*'
                        ]
                    }
                },
                paths: {
                    bowerDirectory: './dist/public/bower_components',
                    bowerJson: 'bower.json'
                }
            })),{name:'bower', ignorePath:'/dist/public/' }))
        .pipe(inject(gulp.src(
            ['./dist/public/scripts/**/*.js', './dist/public/stylesheets/**/*.css'], {read: false}),
            {ignorePath:'/dist/public/'}))
        .pipe(gulp.dest('./dist/views/pages/'));
});

//----------sync-actions----------//

gulp.task('build', ['inject'], function(cb) {
    cb();
});
