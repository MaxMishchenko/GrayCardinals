'use strict';

global.$ = {
    gulp: require('gulp'),
    del: require('del'),
    gp: require('gulp-load-plugins')(),
    strip: require('gulp-strip-comments'),
    browserSync: require('browser-sync').create(),

    path: {
        tasks: require('./gulp/config/tasks.js')
    }
};

$.path.tasks.forEach(function (taskPath) {
    require(taskPath)();
});

$.gulp.task('server', function () {
    $.browserSync.init({
        server: {
            baseDir: './'
        },
        port: 8000,
        open: false
    });
});

$.gulp.task('watch', function () {
    $.gulp.watch('./src/**/*.html', $.gulp.series('html')).on('change', $.browserSync.reload);
    $.gulp.watch('./src/scss/**/*.scss', $.gulp.series('scss')).on('change', $.browserSync.reload);
    $.gulp.watch('./src/partials/**/*.html', $.gulp.series('html')).on('change', $.browserSync.reload);
    $.gulp.watch('./src/js/**/*.js', $.gulp.series('js')).on('change', $.browserSync.reload);
});

$.gulp.task('default', $.gulp.series(
    $.gulp.parallel('html', 'scss', 'js'),
    $.gulp.parallel('server', 'watch')
));
