// Load plugins
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserify = require('gulp-browserify'),
    jsconcat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cache = require('gulp-cache'),
    nunjucksRender = require('gulp-nunjucks-render');
//html
gulp.task('nunjucks', function() {
    return gulp.src(["app/templates/*.njk", '!app/templates/layout/*.njk', '!app/templates/components/**/*.njk'])
        .pipe(nunjucksRender({
            path: ['app/templates/']
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(notify({ message: 'html task complete' }));
}); 

gulp.task('sass-deploy', function () {
 return gulp.src(['app/bootstrap/**/*.scss','app/styles/*.scss'])
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('sass', function () {
 return gulp.src(['app/bootstrap/**/*.scss','app/styles/*.scss'])
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('dist/css'));
});
//font
gulp.task('font', function () {
 return gulp.src(['app/bootstrap/fonts/*.eot','app/bootstrap/fonts/*.svg','app/bootstrap/fonts/*.ttf','app/bootstrap/fonts/*.woff','app/bootstrap/fonts/*.woff2'])
  .pipe(gulp.dest('dist/fonts/bootstrap'));
});

// js
gulp.task('js-vendor', function() {
  return gulp.src(['./app/js/vendor/jquery.min.js',
          './app/bootstrap/javascripts/bootstrap.min.js'])
    .pipe(jsconcat('vendor.js'))
    .pipe(gulp.dest('app/js/vendor'));
});

gulp.task('js', function() {
  return gulp.src(['app/js/*.js'])
    .pipe(browserify())
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'js task complete' }));
});

//Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload())
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean

gulp.task('clean', del.bind(null, ['dist']));

// Watch
gulp.task('watch', function() {

  gulp.watch('app/templates/**/*.njk', ['nunjucks']);
  // Watch .scss files
  gulp.watch('app/**/*.scss', ['sass']);
  // Watch .js files
  gulp.watch('app/**/*.js', ['js']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);


  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
  // Create LiveReload server
  livereload.listen();

});

//Server
gulp.task('server', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 9000,
      https: false
    }));
  gulp.start('watch');
});

gulp.task('build', ['images','sass','nunjucks','js','font'], () => {
  return gulp.src('dist/**/*');
});

gulp.task('deploy', ['images','sass-deploy','nunjucks','js','font','js-vendor'], () => {
  return gulp.src('dist/**/*');
});
// Default task
gulp.task('default', ['build','watch','server']);