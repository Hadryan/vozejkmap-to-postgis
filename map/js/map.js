var M = (function(my) { "use strict";
    var basemap, map, vozejkmap;
    my.version = "0.0.1";

    basemap = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");

    map = L.map("map", {
        center: [49.805, 15.48],
        layers: [basemap],
        zoom: 8,
    });

    return my;
})({});