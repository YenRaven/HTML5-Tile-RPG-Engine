const gulp = require('gulp');
const webpack = require('webpack-stream');
const watch = require('gulp-watch');
const shell = require('gulp-shell');
const path = require('path');


function build(){
    return gulp.src('src/index.js')
      .pipe(webpack( require('./webpack.config.js') ))
      .pipe(gulp.dest('build/'));
}

function html(){
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('build/'));
}

function assets(){
    return gulp.src('assets/*')
        .pipe(gulp.dest('build/assets/'));
}

gulp.task('html', function(){
    return html();
})

gulp.task('assets', function(){
    return assets();
})

gulp.task('build', ['html', 'assets'], function() {
    return build();
});

gulp.task('watch', ['build'], function(){
    return watch(['src/**/*', 'assets/**/*'], function( file ) {
        console.log("Watch Triggered!", file.basename);
        switch (file.extname){
            case ".html":
            case ".htm":
                html();
            case ".jpg":
            case ".jpeg":
            case ".png":
            case ".gif":
                assets();
            case ".js":
            default:
                build();
        };
    });
});

gulp.task('server', [], shell.task("node server.js"));

gulp.task('dev', ['watch', 'server'], function(){});

gulp.task('default', ['dev'], function(){
});
