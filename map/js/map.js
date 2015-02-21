var M = (function(my) { "use strict";
    var basemap, cluster,
        colors = [
            "#B02B2C", "#6BBA70", "#3F4C6B", "#356AA0", "#D01F3C", "#73880A",
            "#C79810", "magenta", "grey", "ivory", "pink", "maroon", "navy"
        ],
        json, map, styles, vozejkmap;
    my.version = "0.0.2";

    basemap = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");

    map = L.map("map", {
        center: [49.805, 15.48],
        layers: [basemap],
        zoom: 8,
    });

    json = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(L.Util.template("<h1>{title}</h1><p>{description}</p>", {
                title: feature.properties.title,
                description: feature.properties.description
            }));
        },
        pointToLayer: function(feature, position) {
            var style = {
                "color": "#444",
                "fillColor": colors[parseInt(feature.properties.location_type)],
                "fillOpacity": 1,
                "radius": 5,
                "weight": 1
            }

            return L.circleMarker(position, style);
        }
    });

    cluster = L.markerClusterGroup();
    cluster.addLayer(json).addTo(map);

    return my;
})({});