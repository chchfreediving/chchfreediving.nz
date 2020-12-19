const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
var del = require("del");

function nunjucks() {
    return gulp.src('src/**/*.njk')
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        .pipe(gulp.dest('target'))
}

function copyAssets() {
    return gulp.src('./assets/*')
        .pipe(gulp.dest('./target/assets'));
}

function copyCss() {
    return gulp.src('./src/*.css')
        .pipe(gulp.dest('./target'));
}

exports.build = gulp.parallel(nunjucks, copyCss, copyAssets);
exports.clean = function() {
    return del('target')
}
