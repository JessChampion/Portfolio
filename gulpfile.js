var gulp = require('gulp'),
    compass = require('gulp-compass'),
    inject = require('gulp-inject'),
    bower = require('gulp-bower'),
    run = require('gulp-run'),
    bowerFiles = require('main-bower-files'),
    git = require('gulp-git'),
    sass = require('gulp-ruby-sass')
;

var SRC = {
    bower: 'bower_components',
    styles: 'src/styles',
    scripts: 'src/scripts',
    views: 'src/views',
    assets: 'src/assets'
};

var DEST = {
    dist:   'dist',
    public: 'dist/public',
    bower:  'dist/public/bower_components',
    styles: 'dist/public/stylesheets',
    scripts:'dist/public/scripts',
    views:  'dist/views',
    pages:  'dist/views/pages',
    index:  'dist/views/pages/index.html',
    assets: 'dist/public/assets',
    overrides: {
        bootstrap: [
            './dist/js/bootstrap.js',
            './dist/css/*.min.*',
            './dist/fonts/*.*'
        ]
    }
};

var PATTERN = {
    styles: '/**/*.scss',
    css: '/**/*.css',
    scripts: '/**/*.js',
    all: '/**/*.*'
};

/////////////////////////////////////////////
////             MAIN TASKS              ////
/////////////////////////////////////////////

gulp.task('default', ['build'], function() {});

gulp.task('dev', ['build', 'serve'], function() {
    gulp.watch(SRC.styles + PATTERN.styles, ['compass:live', 'inject:live']);
    gulp.watch(SRC.scripts + PATTERN.scripts, ['js:live', 'inject:live']);
    gulp.watch(SRC.views + PATTERN.all, ['html:live', 'inject:live']);
    gulp.watch(SRC.assets + PATTERN.all, ['assets:live', 'inject:live']);
    gulp.watch(SRC.bower + PATTERN.all, ['bower:live', 'inject:live']);
    gulp.watch(SRC.bower, ['bower:live', 'inject:live']);
});

gulp.task('server', ['build', 'serve'], function() {
  
});

/////////////////////////////////////////////
////              SUB-TASKS              ////
/////////////////////////////////////////////

gulp.task('clean', function (cb) {
    run('rm -rf '+ DEST.dist).exec();
    cb();
});

//------------GROUP-BOWER-----------//
    //-------------BOWER-LIB------------//

        function runBowerLib() {
            //run bower install
            return bower()
                .pipe(gulp.dest(SRC.bower));
        }

        gulp.task('bower:lib', ['clean'], function() {
            return runBowerLib();
        });

        gulp.task('bower:lib:live', function() {
            return runBowerLib();
        });

    //-----------END-BOWER-LIB----------//
    //-----------BOWER-INCLUDE----------//

        function runBowerInclude() {
            //copy files to dist
            return gulp.src(SRC.bower + PATTERN.all)
                .pipe(gulp.dest(DEST.bower));
        }

        gulp.task('bower:include', ['bower:lib'], function() {
            return runBowerInclude();
        });

        gulp.task('bower:include:live', ['bower:lib:live'], function() {
            return runBowerInclude();
        });

    //---------END-BOWER-INCLUDE--------//

    gulp.task('bower', ['bower:lib','bower:include'], function(cb) {
        cb();
    });

    gulp.task('bower:live', ['bower:lib:live','bower:include:live'], function(cb) {
        cb();
    });

//----------END-GROUP-BOWER---------//
//----------GROUP-COMPILE-----------//
    //-------------COMPASS--------------//

        function runCompass() {
            return gulp.src(SRC.styles + PATTERN.styles)
                .pipe(compass({
                    css: DEST.styles,
                    sass: SRC.styles
                }))
                .pipe(gulp.dest(DEST.styles));
        }

        gulp.task('compass', ['bower'], function() {
            return runCompass();
        });

        gulp.task('compass:live', function() {
            return runCompass();
        });

    //-----------END-COMPASS------------//
    //----------------JS----------------//

        function runJs() {
            return gulp.src(SRC.scripts + PATTERN.scripts)
                .pipe(gulp.dest(DEST.scripts));
        }

        gulp.task('js', ['bower'], function () {
            return runJs();
        });

        gulp.task('js:live', function () {
            return runJs();
        });

    //--------------END-JS--------------//
    //---------------HTML---------------//

        function runHtml() {
            return gulp.src(SRC.views + PATTERN.all)
                .pipe(gulp.dest(DEST.views));
        }

        gulp.task('html', ['bower'], function () {
            return runHtml();
        });

        gulp.task('html:live', function () {
            return runHtml();
        });

    //-------------END-HTML-------------//
    //--------------ASSETS--------------//

        function runAssets() {
            return gulp.src(SRC.assets + PATTERN.all)
                .pipe(gulp.dest(DEST.assets));
        }

        gulp.task('assets', ['bower'], function () {
            return runAssets();
        });

        gulp.task('assets:live', function () {
            return runAssets();
        });

    //------------END-ASSETS------------//

    gulp.task('compile', ['bower','compass','js', 'html', 'assets'], function(cb) {
        cb();
    });

//--------END-GROUP-COMPILE---------//
//----------GROUP-INJECT------------//

    function runInject() {
        return gulp.src(DEST.index)
            .pipe(inject(gulp.src(bowerFiles(
                {
                    overrides: {
                        bootstrap: {
                            main: DEST.overrides.bootstrap
                        }
                    },
                    paths: {
                        bowerDirectory: DEST.bower,
                        bowerJson: 'bower.json'
                    }
                })),{name:'bower', ignorePath: DEST.public }))
            .pipe(inject(gulp.src(
                [ DEST.scripts + PATTERN.scripts, DEST.styles + PATTERN.css], {read: false}),
                {ignorePath: DEST.public}))
            .pipe(gulp.dest(DEST.pages));
    }

    gulp.task('inject', ['compile'], function() {
        return runInject()
    });

    gulp.task('inject:live', function() {
        return runInject()
    });

//--------END-GROUP-INJECT----------//
//------------GROUP-GIT-------------//

    gulp.task('commit', function() {
        var message = "Heroku deployment at" + Date.now().toLocaleString();
        git.commit(message, {args: '-a'});
    });

    gulp.task('push', ['commit'], function(){
        git.push('origin', 'master', function (err) {
            if (err) throw err;
        });
    });

//----------END-GROUP-GIT-----------//
//----------GROUP-ACTIONS-----------//

    gulp.task('build', ['inject'], function(cb) {
        cb();
    });

    gulp.task('serve', function() {
        var express = require('express');
        var app = express();
        app.set('port', (process.env.PORT || 5000));

        app.use(express.static(__dirname + '/dist/public'));
        app.use(express.static(__dirname + '/dist/assets'));
        app.use(express.static(__dirname + '/dist/views/html'));

        // views is directory for all template files
        app.set('views', __dirname + '/dist/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.get('/', function(request, response) {
            response.render('pages/index');
        });

        app.listen(app.get('port'), function() {
            console.log('Node app is running on port', app.get('port'));
        });
    });
//--------END-GROUP-ACTIONS---------//