const path = require('path');
const packageJson = require('../../package.json');
const buildPath = path.join(packageJson.buildPath, 'css');

module.exports = function () {
    $.gulp.task('scss', function () {
        return $.gulp.src('src/scss/main.scss')
            .pipe($.gp.sassGlob())
            .pipe($.gp.sass())
            .on('error', $.gp.notify.onError({
                title: 'Error!'
            }))
            .pipe($.gp.csso({
                restructure: true,
                sourceMap: false,
                debug: false
            }))
            .pipe($.gulp.dest(buildPath));
    });
}