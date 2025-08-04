module.exports = function () {
	$.gulp.task('watch', function () {
		$.gulp.watch('src/*.html', $.gulp.series('html'));
		$.gulp.watch('src/scss/**/*.scss', $.gulp.series('scss'));
		$.gulp.watch('src/js/*.js', $.gulp.series('js'));
	});
}