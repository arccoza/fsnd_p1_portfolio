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


var db = { files: {} };
var src = 'src';
var dest = 'pub';
slug.defaults.mode ='rfc3986';

gulp.task('clean', function() {
  return del(dest);
});

gulp.task('models', ['clean'], function() {
  return gulp.src(src + '/**/*.md')
    .pipe(matter())
    .pipe(gmustache())
    .pipe(markdown())
    .pipe(each(function(content, file, next) {
      var fpath = npath.relative(file.base, file.path);
      var fbase = npath.dirname(fpath);
      var fname = npath.basename(file.path);
      var fdata = file.data;

      fdata.content = content;
      fdata.path = fpath;
      fdata.titleSlug = fdata.title ? slug(fdata.title) : null;
      fdata.dateSlug = fdata.date ? moment(fdata.date).format('YYYY-MM-DD') : null;
      
      if(fdata.collection) {
        db[fdata.collection] = db[fdata.collection] || [];
        db[fdata.collection].push(fdata);
      }
      if(fdata.key)
        db[fdata.key] = fdata;

      db.files[fpath] = fdata;

      console.log(db);
      next(null, content);
    }))
    // .pipe(gdata(function(file) {
    //   console.log(file.data);
    //   return {test: true};
    // }))
    // .pipe(gulp.dest(dest));
});

gulp.task('templates', ['clean'], function() {
  return gulp.src(src + '/**/*.md')
    .pipe(matter())
    .pipe(gmustache())
    .pipe(markdown())
    .pipe(each(function(content, file, next) {
      file.data.content = content;

      if(file.data.template) {
        var tmplPath = npath.join(file.base, file.data.template);
        content = mustache.render(fs.readFileSync(tmplPath, 'utf8'), file.data);
      }
      
      next(null, content);
    }))
    .pipe(gulp.dest(dest));
});