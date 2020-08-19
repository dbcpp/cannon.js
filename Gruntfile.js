var fs = require('fs')

module.exports = function(grunt) {

    var bundlePath = "build/cannon.js",
        minifiedBundlePath = "build/cannon.min.js";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n'
            },

            demo : {
                src: ['src/demo/Demo.js'],
                dest: 'build/cannon.demo.js'
            },
        },

        browserify : {
            cannon : {
                src : ["src/Cannon.js"],
                dest : bundlePath,
                options : {
                    bundleOptions: {
                        standalone : "CANNON"
                    }
                }
            }
        },

        uglify : {
            build : {
                src : [bundlePath],
                dest : minifiedBundlePath
            }
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    outdir : "docs",
                    paths : ["./src/"],
                },
            }
        },

        nodeunit: {
            all: ['test/**/*.js'],
        },

        BbsCopyBuild: {

        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['test', 'concat', 'browserify', 'uglify']);
    grunt.registerTask('test', ['nodeunit']);

    grunt.registerTask('addDate','Adds the current date to the top of the built files',function(){
        var text = '// ' + new Date().toUTCString() + '\n';

        var dev = fs.readFileSync(bundlePath).toString();
        var min = fs.readFileSync(minifiedBundlePath).toString();

        fs.writeFileSync(bundlePath,text+"\n"+dev);
        fs.writeFileSync(minifiedBundlePath,text+"\n"+min);
    });

    grunt.registerTask('addLicense','Adds the LICENSE to the top of the built files',function(){
        var text = fs.readFileSync("LICENSE").toString();

        var dev = fs.readFileSync(bundlePath).toString();
        var min = fs.readFileSync(minifiedBundlePath).toString();

        fs.writeFileSync(bundlePath,text+"\n"+dev);
        fs.writeFileSync(minifiedBundlePath,text+"\n"+min);
    });

    grunt.registerTask('default2', ['concat', 'browserify', 'uglify']);
    grunt.registerTask('copyBuild', '复制build文件', function() {
        console.log('\n***** copyBuild *****\n');
        // 新代码的编译输出;
        let {commjs, minjs} = getSrcFileUrl();
        let commjsCode = fs.readFileSync(commjs).toString();
        let minjsCode = fs.readFileSync(minjs).toString();

        // 写入.cache/dev/.extdep-chunks/目录的cannon的代码文件
        let cocosCannon = getExtendCode(commjsCode);
        let cacheFile = getCacheDevFileUrl();
        fs.writeFileSync(cacheFile, cocosCannon); 

        // 写入node_modules中cannon库的build目录
        let info = getNodeModulesFileUrl();
        fs.writeFileSync(info.commjs, commjsCode);
        fs.writeFileSync(info.minjs, minjsCode);
        
        // 读取.cache/dev/.extdep-chunks/目录的cannon的代码文件地址;
        function getCacheDevFileUrl() {
            let cachePath = '../engine/bin/.cache/dev/'
            let mapfile = cachePath + '.import-map.json';
            var mapJson = JSON.parse(fs.readFileSync(mapfile).toString());
            var cannonName = mapJson['imports']['@cocos/cannon'].substr(2);
            return cachePath + cannonName;
        }

        // 读取.cache/dev/.extdep-chunks/目录的cannon的代码文件地址;
        function getNodeModulesFileUrl() {
            let base = '../engine/node_modules/@cocos/cannon'
            return {commjs:`${base}/build/cannon.js`, minjs:`${base}/build/cannon.min.js`};
        }
        
        function getSrcFileUrl() {
            return {commjs:'./build/cannon.js', minjs:'./build/cannon.min.js'};
        }

        function getExtendCode(src) {
            return `define(['./_commonjsHelpers-f660b1c2'], function (_commonjsHelpers) { 'use strict';
                var cannon_min = _commonjsHelpers.createCommonjsModule(function (module, exports) {
                    ${src}
                });
                return cannon_min;
            });
            `
        }
    });

};
