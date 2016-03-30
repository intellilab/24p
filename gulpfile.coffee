gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'

files =
  coffee: 'src/**/*.coffee',
  copy: [
    'src/**/*.html',
    'src/**/*.css',
  ]

gulp.task 'coffee', ->
  gulp.src files.coffee
    .pipe concat 'app.js'
    .pipe do coffee
    .pipe gulp.dest 'dist'

gulp.task 'copy', ->
  gulp.src files.copy
    .pipe gulp.dest 'dist'

gulp.task 'build', ['coffee', 'copy']

gulp.task 'watch', ->
  gulp.watch files.coffee, ['coffee']
  gulp.watch files.copy, ['copy']
