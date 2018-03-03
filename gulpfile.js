const gulp = require('gulp');
const webpack = require('webpack-stream');
const watch = require('gulp-watch');
const shell = require('gulp-shell');
const path = require('path');
const fs = require('fs');
const glob = require('glob');


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

function compileTileset(data, filePath){
    for(var tileset in data){
        Object.entries(data[tileset].tiles = data[tileset].tiles).forEach( (tile) => {
            data[tileset].tiles[tile[0]] = JSON.parse(fs.readFileSync(path.resolve(filePath, "..", tile[1])));
        })
    }
    return data;
}

function compileWorld(data, filePath){
    data.world = data.world.map((layer) => {
        let newLayer = Object.assign({}, layer);
        newLayer.tileMap = [];
        let tileMapArray = String(fs.readFileSync(path.resolve(filePath, "..", layer.tileMap)))
                            .replace(/\r\n/g, '')
                            .replace(/\n/g, '')
                            .split('');
        while(tileMapArray.length > 0){
            let nextTileStr = "";
            for(let i=0; i<layer.layerInfo.charactersPerTile; i++){
                nextTileStr += tileMapArray.shift();
            }
            newLayer.tileMap.push(nextTileStr);
        }
        return newLayer;
    });
    return data;
}

gulp.task('html', function(){
    return html();
})

gulp.task('assets', function(done){
    gulp.src('assets/images/*')
        .pipe(gulp.dest('build/assets/images'));

    glob("assets/tilesets/**/config.json", function(er, files) {
        if(er != null) {
            console.log(er);
            return null;
        }
        files.forEach((file) => {
            const filePath = path.resolve(__dirname, file);
            const config = JSON.parse(fs.readFileSync(filePath));
            const tilesetName = path.dirname(filePath).split(path.sep).pop();
            const dir = path.resolve(__dirname, "build/assets/tileset");
            if(!fs.existsSync(dir))fs.mkdirSync(dir);
            fs.writeFileSync(
                path.resolve(dir, tilesetName+'.tileset'),
                JSON.stringify(
                    compileTileset(
                        config,
                        filePath
                    )
                )
            );
        });
    });

    glob("assets/world/**/config.json", function(er, files){
        if(er != null) {
            console.log(er);
            return null;
        }
        files.forEach((file) => {
            const filePath = path.resolve(__dirname, file);
            const config = JSON.parse(fs.readFileSync(filePath));
            const worldName = path.dirname(filePath).split(path.sep).pop();
            const dir = path.resolve(__dirname, "build/assets/world");
            if(!fs.existsSync(dir))fs.mkdirSync(dir);
            fs.writeFileSync(
                path.resolve(dir, worldName+'.world'),
                JSON.stringify(
                    compileWorld(
                        config,
                        filePath
                    )
                )
            );
        });
    })

    done();
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
