// Load plugins
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    jade = require('gulp-jade'),
    fs = require('fs'),
    imagemin = require('gulp-imagemin');

// Styles
gulp.task('styles', function() {
  return gulp.src('./assets/styles/**/*.styl')
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(gulp.dest('./public/css/'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Templates
gulp.task('templates', function() {
  
  // TODO: потом сделать отдельный таск build, который будет билдить все в один файл.
  // туда будет подключены стили и яваскрипты, а может быть даже картинки :) 
  // fs.readFile('./public/js/main.js', 'utf8', function (err,data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log(data);
  // });
  
  var config = {
    revision: new Date().getTime()
  };    

  gulp.src('./assets/views/**/*.jade')
    .pipe(jade({
      locals: config
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(notify({ message: 'Templates task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('./assets/javascripts/**/*.js')
    .pipe(concat('main.js'))
    //.pipe(gulp.dest('./public/js/'))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('./assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./public/images/'))
    .pipe(notify({ message: 'Images task complete' }));
});

 
// Clean
gulp.task('clean', function(cb) {
    //del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
    del(['public'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start( 'styles', 'scripts', 'templates', 'images');
});
 
// Watch
gulp.task('watch', function() {
 
  // Watch .style files
  gulp.watch('assets/styles/**/*.styl', ['styles']);
  
  // Watch .js files
  gulp.watch('assets/javascripts/**/*.js', ['scripts']);
 
  // Watch .jade files
  gulp.watch('assets/views/**/*.jade', ['templates']);

  // Watch .png/gif/jpg/jpeg files
  gulp.watch('assets/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['./public/**']).on('change', livereload.changed);
 
});