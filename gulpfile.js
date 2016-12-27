var fs = require('fs');
var npath = require('path');
var del = require('del');
var slug = require('slug');
var moment = require('moment');
var through = require('through2');
var gulp = require('gulp');
var gdata = require('gulp-data');
var each = require('gulp-each');
var markdown = require('gulp-markdown');
var gmustache = require('gulp-mustache');
var mustache = require('mustache');
var matter = require('gulp-gray-matter');
var semanticBuild = require('./semantic/tasks/build');
var semanticWatch = require('./semantic/tasks/watch');
var print = console.log.bind(console);


var db = { files: {} };
var src = 'src';
var dest = 'pub';
slug.defaults.mode ='rfc3986';

var markSrc = function(content, file, next) {
  var fpath = npath.relative(file.base, file.path);
  file.data = file.data || {};
  file.data.src = fpath;

  next(null, content);
};

var scrapeData = function(content, file, next) {
  var fpath = npath.relative(file.base, file.path);
  var fbase = npath.dirname(fpath);
  var fname = npath.basename(file.path);
  var fdata = file.data;

  fdata.content = content;
  fdata.path = fbase;
  fdata.titleSlug = fdata.title ? slug(fdata.title) : null;
  fdata.dateSlug = fdata.date ? moment(fdata.date).format('YYYY-MM-DD') : null;
  fdata.dateFormatted = fdata.date ? moment(fdata.date).format('MMM YYYY') : null;
  
  if(fdata.collection) {
    db[fdata.collection] = db[fdata.collection] || [];
    db[fdata.collection].push(fdata);
  }
  if(fdata.key)
    db[fdata.key] = fdata;

  db.files[fdata.src] = fdata;

  print(fdata.src);
  next(null, content);
};

var renderHtml = function(content, file, next) {
  // var fpath = npath.relative(file.base, file.path);
  var fdata = db.files[file.data.src];
  db.self = fdata;
  print(fdata.src);
  // file.data.content = content;

  if(fdata.template) {
    var tmplPath = npath.join(file.base, fdata.template);
    content = mustache.render(fs.readFileSync(tmplPath, 'utf8'), db);
  }
  
  next(null, content);
};


gulp.task('clean', function() {
  return del.sync([dest + '/**/*', '!' + dest + '/fw/**']);
});

gulp.task('models', ['clean'], function() {
  return gulp.src(src + '/**/*.md')
    .pipe(each(markSrc))
    .pipe(matter())
    .pipe(gmustache())
    .pipe(markdown())
    .pipe(each(scrapeData))
    // .pipe(gdata(function(file) {
    //   console.log(file.data);
    //   return {test: true};
    // }))
    // .pipe(gulp.dest(dest));
});

gulp.task('templates', ['clean', 'models'], function() {
  return gulp.src(src + '/**/*.md')
    .pipe(each(markSrc))
    .pipe(matter())
    .pipe(gmustache())
    .pipe(markdown())
    .pipe(each(renderHtml))
    .pipe(gulp.dest(dest));
});

gulp.task('images', ['clean'], function() {
  return gulp.src(src + '/**/*.@(png|jpg|gif|webp|svg)')
    .pipe(gulp.dest(dest));
});

gulp.task('build:semantic', semanticBuild);
gulp.task('watch:semantic', semanticWatch);

gulp.task('build:all', ['build:semantic', 'models', 'templates', 'images']);
gulp.task('build:ui', ['build:semantic']);
gulp.task('build:site', ['models', 'templates', 'images']);

gulp.task('watch:ui', ['watch:semantic']);