#!/usr/bin/env node
var path = require("path"),
    fs = require("fs"),
    child_process = require("child_process"),
    ejs = require("ejs");

/* Read all of the images.json files in image_urls. */
var image_json_files = fs.readdirSync("./image_urls"),
    images_json_container = {};
for (var i = 0, l = image_json_files.length; i < l; i++) {
    var image_json_filename = image_json_files[i];
    images_json_container[image_json_filename] = fs.readFileSync("./image_urls/" + image_json_filename + "/images.json");
}

var gallery_pages = [{
    filename: "gallery-chairs.html",
    page: "gallery-chairs",
    gallery_type: "gallery"
}, {
    filename: "gallery-cheese-boards.html",
    page: "gallery-cheese-boards",
    gallery_type: "gallery"
}, {
    filename: "gallery-desks.html",
    page: "gallery-desks",
    gallery_type: "gallery"
}, {
    filename: "gallery-display-stands.html",
    page: "gallery-display-stands",
    gallery_type: "gallery"
}, {
    filename: "gallery-plant-holder.html",
    page: "gallery-plant-holder",
    gallery_type: "gallery"
}, {
    filename: "gallery-tables.html",
    page: "gallery-tables",
    gallery_type: "gallery"
}, {
    filename: "gallery-tea-coasters.html",
    page: "gallery-tea-coasters",
    gallery_type: "gallery"
}, {
    filename: "gallery-tulip-table.html",
    page: "gallery-tulip-table",
    gallery_type: "gallery"
}, {
    filename: "restoration_chairs0.html",
    page: "gallery-chairs0",
    gallery_type: "portfolio"
}, {
    filename: "restoration_chairs1.html",
    page: "gallery-chairs1",
    gallery_type: "portfolio"
}, {
    filename: "restoration_chairs2.html",
    page: "gallery-chairs2",
    gallery_type: "portfolio"
}, {
    filename: "restoration_chairs3.html",
    page: "gallery-chairs3",
    gallery_type: "portfolio"
}, {
    filename: "restoration_tables0.html",
    page: "gallery-tables0",
    gallery_type: "portfolio"
}, {
    filename: "restoration_tables1.html",
    page: "gallery-tables1",
    gallery_type: "portfolio"
}, {
    filename: "restoration_tables2.html",
    page: "gallery-tables2",
    gallery_type: "portfolio"
}, {
    filename: "restoration_tables3.html",
    page: "gallery-tables3",
    gallery_type: "portfolio"
}];

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
