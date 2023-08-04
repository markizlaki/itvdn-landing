const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug')
const sass = require('gulp-sass')(require('sass'))
const spritesmith = require('gulp.spritesmith')
const del = require('del')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


/* ----------- Server----------------*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ----------- Pug compile----------------*/
gulp.task('templates:compile', function() {
    return gulp.src('source/template/index.pug')
    .pipe(
        pug({
            pretty: true
        })
    )
    .pipe(gulp.dest('build'));
});

/* ----------- Styles----------------*/
gulp.task('styles:compile', function() {
    return gulp.src('source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(autoprefixer({
            grid: true,
            cascade: false,
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'));
    });

/* ------------- js-------------------*/

gulp.task('js', function() {
    return gulp.src([
        'source/js/form.js',
        'source/js/navigation.js',
        'source/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

/* ----------- Sprites----------------*/
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

function clear(){
    return del('build')
}

exports.clear = clear

/* ----------- Copy fonts------------*/
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
    });

/* ----------- Copy images------------*/
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
    });

/* ----------- Copy------------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/* ----------- Watchers------------*/
gulp.task('watch', function(){
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.scss', gulp.series('js'));
});

/* ----------- Default------------*/
gulp.task('default', gulp.series(
    clear,
    gulp.parallel('templates:compile', 'styles:compile', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));
