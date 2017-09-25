const config = require("./config.json");

const gulp            = require('gulp');
const plumber         = require('gulp-plumber');
const autoprefixer    = require('gulp-autoprefixer');
const babel           = require('gulp-babel');
const concat          = require('gulp-concat');
const uglify          = require('gulp-uglify');
const minifyCss       = require('gulp-minify-css');
const sass            = require('gulp-sass');
const imagemin        = require('gulp-imagemin');
const htmlmin         = require('gulp-htmlmin');
const browserSync     = require('browser-sync');

gulp.task('start', function() {
  browserSync.init(config.browserSync);
});

gulp.task('reload', function () {
  browserSync.reload();
});

gulp.task('build:css', function(){
  return gulp.src([config.paths.styles.src])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(config.paths.styles.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build:js', function(){
  return gulp.src([config.paths.scripts.src])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.scripts.dist))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build:images', function(){
  gulp.src(config.paths.images.src)
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  .pipe(gulp.dest(config.paths.images.dist));
});

gulp.task('build:html', function () {
  return gulp.src(config.paths.html.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(config.paths.html.dist))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('compile', [
  'build:css',
  'build:js',
  'build:images',
  'build:html'
]);

gulp.task('default', ['start', 'compile'], function(){
  gulp.watch(config.paths.styles.watch,   ['build:css']);
  gulp.watch(config.paths.scripts.src,    ['build:js']);
  gulp.watch(config.paths.images.src,     ['build:images']);
  gulp.watch(config.paths.html.src,       ['build:html']);
});