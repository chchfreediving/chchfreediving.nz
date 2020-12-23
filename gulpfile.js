const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require("del");
const collect = require("gulp-collect");

// Render nunjucks source to html.
function nunjucks() {
    return newsItems(
        news => gulp.src('src/*.njk')
            .pipe(nunjucksRender({
                path: ['src/templates'],
                // Pass in the news items, only used by news.njk.
                data: {
                    newsItems: news
                }
            }))
            .pipe(gulp.dest('target'))
    ); 
}

// Read the news items from the news directory, convert into a JS array and pass to `cb`.
function newsItems(cb) {
    return gulp.src('./news/*.json')
        // collect.list merges all the files into a single list.
        .pipe(collect.list(files => {
            const news = files
                // Parse the json to JS objects.
                .map(f => JSON.parse(f.contents.toString()))
                // Sort the news items by date.
                .sort((a, b) => {
                    if (a.date < b.date) return +1;
                    if (a.date > b.date) return -1;
                    return 0;
                })
                // Convert each item's date to a user-friendly form.
                .map(n => {
                    let date = new Date(n.date);
                    n.date = date.toLocaleDateString("en-NZ", { year: 'numeric', month: 'long', day: 'numeric' });
                    return n;
                });
            // Call the callback with the news items.
            cb(news);
            return files;
        }));
}

function copyAssets() {
    return gulp.src('./assets/*')
        .pipe(gulp.dest('./target/assets'));
}

function copyResources() {
    return gulp.src('./resources/*')
        .pipe(gulp.dest('./target/resources'));
}

function copyCss() {
    return gulp.src('./src/*.css')
        .pipe(gulp.dest('./target'));
}

exports.build = gulp.parallel(nunjucks, copyCss, copyAssets, copyResources);
exports.clean = function() {
    return del('target');
}
