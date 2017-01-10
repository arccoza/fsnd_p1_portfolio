var fs = require('fs');
var npath = require('path');
var del = require('del');
var slug = require('slug');
var moment = require('moment');
var gulp = require('gulp');
var series = require('gulp-sequence');
var gdata = require('gulp-data');
var each = require('gulp-each');
var gif = require('gulp-if');
var markdown = require('gulp-markdown');
var gmustache = require('gulp-mustache');
var mustache = require('mustache');
var matter = require('gulp-gray-matter');
var changed = require('gulp-changed');
var semanticBuild = require('./semantic/tasks/build');
var semanticWatch = require('./semantic/tasks/watch');
var print = console.log.bind(console);


var db = { files: {} };
var src = 'src';
var dest = 'pub';
slug.defaults.mode ='rfc3986';

// Gulp plugin to mark the original src of the file.
var markSrc = function(content, file, next) {
  var fpath = npath.relative(file.base, file.path);
  file.data = file.data || {};
  file.data.src = fpath;

  next(null, content);
};

// Gulp plugin to scrape data from .md files and add it to a data structure.
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

  // if(fdata.media && fdata.media.images) {
  //   for(let k of Object.keys(fdata.media.images)) {

  //   }
  // }
  
  if(fdata.collection) {
    // TODO: Iron out kinks in this collection update code.
    db[fdata.collection] = db[fdata.collection] || [];
    db[fdata.collection]._index = db[fdata.collection]._index || {};
    let idx = db[fdata.collection]._index[fdata.src] || db[fdata.collection].length;
    db[fdata.collection]._index[fdata.src] = idx;
    db[fdata.collection][idx] = fdata;
  }
  if(fdata.key)
    db[fdata.key] = fdata;

  db.files[fdata.src] = fdata;

  print(fdata.src);
  next(null, content);
};

// Gulp plugin to render .md files using data collected by `scrapeData`
// and templates specified by their `template` property (frontmatter).
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

// Gulp clean task, deletes everything in the dest folder, except `fw`.
function clean() {
  return del.sync([dest + '/**/*', '!' + dest + '/fw/**']);
}

// Gulp models task, creates a data structure out of all the `md` files,
// to be passed to templates in other tasks.
function models() {
  db = { files: {} };

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
}

// Gulp templates task builds the html for the site from
// templates and data from the models task.
function templates() {
  return gulp.src(src + '/**/*.md')
    // .pipe(changed(dest, { extension: '.html' }))
    .pipe(each(markSrc))
    .pipe(matter())
    .pipe(gmustache())
    .pipe(markdown())
    .pipe(each(renderHtml))
    .pipe(gulp.dest(dest));
}

// Gulp task to prep images for the static site.
function images() {
  return gulp.src(src + '/**/*.@(png|jpg|gif|webp|svg)')
    .pipe(changed(dest))
    .pipe(gulp.dest(dest));
}

// Build the site, models -> templates and images.
gulp.task('build:clean', clean);
gulp.task('build:models', models);
gulp.task('build:templates', templates);
gulp.task('build:images', images);
gulp.task('build:site', series('build:clean', 'build:models', 'build:images', 'build:templates'));
// Build CSS and JS for the UI.
gulp.task('build:semantic', semanticBuild);
gulp.task('build:ui', ['build:semantic']);
// Build everything.
gulp.task('build', ['build:semantic', 'build:site']);
// Watch for changes and update site.
gulp.task('update:images', images);
// Arrow function wrapper around `series` neccessary because `series` returns a thunk
// which can only be run once and is no good for a watcher.
gulp.task('update:site', done => series('build:models', 'build:templates')(done));
gulp.task('watch:site', function(done) {
  gulp.watch(src + '/**/*.@(md|html)', ['update:site']);
  gulp.watch(src + '/**/*.@(png|jpg|gif|webp|svg)', ['update:images']);
});
// Watch for changes on the CSS and JS for the UI.
gulp.task('watch:semantic', semanticWatch);
gulp.task('watch:ui', ['watch:semantic']);
// Watch everything.
gulp.task('watch', ['watch:site', 'watch:ui']);
