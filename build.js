#!/usr/bin/env node
var path = require("path"),
    fs = require("fs"),
    child_process = require("child_process"),
    ejs = require("ejs"),
    gallery_pages = require("./gallery_pages.json");

/* Read all of the images.json files in image_urls. */
var image_json_files = fs.readdirSync("./image_urls"),
    images_json_container = {};
for (var i = 0, l = image_json_files.length; i < l; i++) {
    var image_json_filename = image_json_files[i];
    images_json_container[image_json_filename] = fs.readFileSync("./image_urls/" + image_json_filename + "/images.json");
}

files = fs.readdirSync("./pages");

for (var i = 0, l = files.length; i < l; i++) {
    var filename = files[i],
        inputDir = "./pages/" + filename;
    if (fs.statSync(inputDir).isDirectory()) {
        var inputFile = inputDir + "/" + filename;
        process.stderr.write("Creating " + filename + " from " + inputFile + "... ");

        var ejsFile = fs.readFileSync(inputFile + ".ejs", "utf8"),
            renderedEjs = ejs.render(ejsFile, {"images_json_container": images_json_container}, {filename: filename + ".ejs"});
        fs.writeFileSync(filename, renderedEjs);

        process.stderr.write("Done.\n");
    }
}

var gallery_template = fs.readFileSync("template/gallery-template.html", "utf8");
for (var i = 0, l = gallery_pages.length; i < l; i++) {
    var gallery_page = gallery_pages[i];
    gallery_page["images_json_container"] = images_json_container;

    process.stderr.write("Creating " + gallery_page.filename + " from gallery template... ");

    var renderedEjs = ejs.render(gallery_template, gallery_page, {filename: "template/gallery-template.ejs"});
    fs.writeFileSync(gallery_page.filename, renderedEjs);

    process.stderr.write("Done.\n");
}
