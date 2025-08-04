const path = require('path');
const packageJson = require('../../package.json');
const buildPath = path.join(packageJson.buildPath, 'js');

module.exports = function () {
	$.gulp.task('js', function () {
		return $.gulp.src('src/js/*.js', {allowEmpty:true})
				.pipe($.gp.terser())
				.pipe($.strip())
				.pipe($.gulp.dest(buildPath));
	});
}