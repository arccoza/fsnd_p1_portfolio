var npath = require('path');
var through = require('through2');
var gulp = require('gulp');
var gdata = require('gulp-data');
var each = require('gulp-each');
var markdown = require('gulp-markdown');
var mustache = require('gulp-mustache');
var matter = require('gulp-gray-matter');


var db = { root: { _models: [] } };
var src = 'src';
var dest = 'pub';

gulp.task('models', function() {
  return gulp.src(src + '/**/*.md')
    // .pipe()  // TODO: Write a plugin that parses .md files and builds a collection of model data for other tasks.
    .pipe(matter())
    .pipe(markdown())
    .pipe(each(function(content, file, next) {
      var fpath = npath.relative(npath.join(file.cwd, src), file.base);
      var fdata = file.data;
      fdata.content = content;
      db.root._models.push(fdata);

      console.log(db);
      next(null, content);
    }))
    .pipe(gdata(function(file) {
      console.log(file.data);
      return {test: true};
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('templates', function() {
  return gulp.src(src + '/**/*.html')
    .pipe(matter())
    .pipe(mustache())
    .pipe(gulp.dest(dest));
});