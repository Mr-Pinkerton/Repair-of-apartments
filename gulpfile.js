const gulp = require('gulp'); // Подключаем Gulp
const browserSync = require('browser-sync').create(); // Подключаем browser-sync
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include'); // Для подключения файлов друг в друга


// Таск для сборки HTML из шаблонов
gulp.task('html', function (callback) {
    return gulp.src('./app/html/*.html')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'HTML include',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileinclude({
            prefix: '@@'
        }))
        // .pipe(gulp.dest('./app/')); //Убрать если не надо собирать из шаблонов
    callback();
});

// Таск для компиляции SASS в CSS
gulp.task('sass', function (callback) {

    return gulp.src('./app/sass/style.sass')

        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'SASS',
                    sound: false,
                    message: err.message
                };
            })
        }))

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/css/'));

    callback();

});

// Задача для обновления сервера при изменениях во всех файлах с расширением .html .css
gulp.task('watch', function () {
    // Следит за изменениями в html, css, js и обновляет браузер
    watch(['./app/*.html', './app/css/**/*.css', './app/js/**/*.js'], gulp.parallel(browserSync.reload));
    // Следит за изменением в sass файлах и компилирует их в css
    // watch('./app/sass/**/*.sass', gulp.parallel('sass'));
    // С задержкой 100мс
    watch('./app/sass/**/*.sass', function () {
        setTimeout(gulp.parallel('sass'), 100);
    });
    // Слежение за HTML и сборка страниц из шаблонов
    watch('./app/html/**/*.html', gulp.parallel('html'));
});

// Задача для старта сервера из папки app
gulp.task('server', function () {

    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });

});

gulp.task('default', gulp.parallel('server', 'watch', 'sass', 'html'));