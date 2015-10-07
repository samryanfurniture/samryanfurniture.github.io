#!/usr/bin/env node
var path = require("path"),
    fs = require("fs"),
    child_process = require("child_process"),
    ejs = require("ejs");

files = fs.readdirSync("./pages");

for (var i = 0, l = files.length; i < l; i++) {
    var filename = files[i],
        inputDir = "./pages/" + filename;
    if (fs.statSync(inputDir).isDirectory()) {
        var inputFile = inputDir + "/" + filename;
        process.stderr.write("Creating " + filename + " from " + inputFile + "... ");

        var phpReturn = child_process.spawnSync("php", ["-f", inputFile])
        fs.writeFileSync(inputFile + ".ejs", phpReturn.stdout);

        var ejsFile = fs.readFileSync(inputFile + ".ejs", "utf8"),
            renderedEjs = ejs.render(ejsFile);
        fs.writeFileSync(filename, renderedEjs);

        process.stderr.write("Done.\n");
    }
}
