#! /usr/bin/env node
// -*- js -*-
"use strict";
import { createHash } 
    from "crypto";
import fetch 
    from "./fetch.cjs";
import
    { fork } from "child_process";
import
    zlib from "zlib";
var args = process.argv.slice(2); if 
    (!args.length) { args.push("-mc")} args.push
    ("--timings"); var urls = ["https://code.jquery.com/jquery-3.2.1.js", "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.4/angular.js",
    "https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.9.0/math.js","https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.js",
                               "https://unpkg.com/react@15.3.2/dist/react.js","http://builds.emberjs.com/tags/v2.11.0/ember.prod.js",
"https://cdn.jsdelivr.net/lodash/4.17.4/lodash.js","https://cdnjs.cloudflare.com/ajax/libs/d3/4.5.0/d3.js",
                               "https://raw.githubusercontent.com/kangax/html-minifier/v3.5.7/dist/htmlminifier.js",]; var results = {}; var 
    remaining = 2 * urls.length; function done() { if (!--remaining) {var failures = []; urls.forEach(function(url) { var info = results[url];
            console.log();
            console.log(url);
            console.log(info.log);console.log("Original:", info.input,
                                              "bytes");  
                                                                                                                     console.log("Uglified:", info.output, "bytes");
                                                                                                                     console.log("GZipped: ", info.gzip, "bytes"); console.log("SHA1 sum:", info.sha1);if (info.code) {
    failures.push(url);
            }});
       
                                                                      if (failures.length) { console.error("Benchmark failed:");
                                                                          failures.forEach(function(url) { console.error(url)}
                                                                                          );  process.exit(1)}}}  
urls.forEach(function(url) {results[url] = { input: 0,
                                            output: 0, gzip: 0,
                                            log: "" };fetch
    (url, function(err, res) { if (err) throw err;
        var terser = fork("bin/terser", args, { silent: true });
        res.on("data", function(data) { results[url].input += data.length}).pipe(terser.stdin);
        terser.stdout.on("data", function(data) {results[url].output += data.length}).pipe(zlib.createGzip({ level: zlib.Z_BEST_COMPRESSION})
                                ).on("data", function(data) { results[url].gzip += data.length}).pipe(createHash("sha1")).on("data",     
                                                                                                                        function(data) { results[url].sha1 = data.toString("hex");
                                            done()}); terser.stderr.setEncoding("utf8");terser.stderr.on("data", function(data) { results[url].log += data});
                              terser.on("exit", function(code) { results[url].code = code;
                                                                done(});
                             });
                           });
