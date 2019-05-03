var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
// var connect = require('gulp-connect');
var gulpClean = require('gulp-clean');
var gulpSass = require('gulp-sass')
var gulpWatch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

const paths = {
  sass: {
    src: [
      './src/sass/*.sass'
    ],
    dest: './temp/css/'
  },
  css: {
    src: ['./temp/css/*.css'],
    dest: './public/css/'
  },
  scripts: {
    src: [
      './src/js/script-content.js',
      './src/js/script-control-font.js',
      './src/js/script-control-font-family.js',
      './src/js/script-control-scroll.js',
      './src/js/scene.js',
    ],
    dest: './public/js/'
  },
  jsLib: {
    src: [
      '../node_modules/jquery/dist/jquery.min.js',
      '../node_modules/vue/dist/vue.min.js',
      '../node_modules/socket.io-client/dist/socket.io.slim.js',
      '../node_modules/autosize/dist/autosize.min.js',
      '../node_modules/qr-image/lib/qr.js',
    ],
    dest: './public/js/'
  },
  template: {
    src: [
      './src/index.html'
    ],
    dest: './public/'
  }
}

function compileSass() {
  // out put style default is 'nested'
  sassParams = {
    // outputStyle: 'nested'
    // outputStyle: 'expanded'
    // outputStyle: 'compact'
    outputStyle: 'compressed'
  }
  return gulp.src(paths.sass.src)
      .pipe(gulpSass.sync(sassParams).on('error', gulpSass.logError))
    .pipe(gulp.dest(paths.sass.dest))
}

function concatJsLib() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(gulpConcat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest));
}

function concatJs() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(gulpConcat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scripts.dest));
}

function concatJsLib() {
  return gulp.src(paths.jsLib.src)
    .pipe(gulpConcat('lib.js'))
    .pipe(gulp.dest(paths.jsLib.dest));
}

function concatCss() {
  return gulp.src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(gulpConcat('main.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css.dest));
}

function copy() {
  // return gulp.src('./src/index.html')
  //   .pipe(gulp.dest('./public/'));

  return gulp.src(paths.template.src)
    .pipe(gulp.dest(paths.template.dest));
}

function clean () {
  return gulp.src(['./temp', paths.scripts.dest, paths.css.dest], {read: false})
    .pipe(gulpClean());
}

const css = gulp.series(compileSass, concatCss)

function watch() {
  gulp.watch(paths.scripts.src, gulp.series(concatJs));
  gulp.watch(paths.template.src, gulp.series(copy));
  gulp.watch(paths.sass.src, gulp.series(css));
}



exports.watch = watch
exports.clean = clean
exports.js = concatJs
exports.css = css
exports.copy = copy
exports.default = gulp.series(copy, concatJsLib, gulp.parallel(concatJs, css))
exports.dev = gulp.series(copy, concatJsLib, gulp.parallel(concatJs, css), watch)

