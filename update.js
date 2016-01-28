#!/usr/bin/env node
var imgur_gallery = require("./imgur_gallery/imgur_gallery.js"),
    gallery_pages = require("./gallery_pages.json");

var accountName = "samryanfurniture";
imgur_gallery.getUserAlbums(accountName, function (albumsInfo) {
  /* Associate albums with gallery pages */
  for (var i=0; i<albumsInfo.length; i++) {
    for (var j=0;j<gallery_pages.length;j++) {
      if (albumsInfo[i].title == gallery_pages[j].name) {
        gallery_pages[j].albumInfo = albumsInfo[i];
      }
    }
  }
  for (var i=0; i<gallery_pages.length;i++) {
    console.log(gallery_pages[i].albumInfo.id + ": " + gallery_pages[i].name + " ++ " + gallery_pages[i].filename);
  }
}, function (failureReason) {
  log("ERROR from getUserAlbums: " + failureReasons[failureReason]);
});
