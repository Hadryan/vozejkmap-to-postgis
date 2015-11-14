var M = (function(my) { "use strict";
    var basemap, categories = {}, cluster, json, map, styles, mapkey, overlays = {};
    my.version = "1.0";

    basemap = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");

    map = L.map("map", {
        center: [49.805, 15.48],
        layers: [basemap],
        zoom: 8,
    });

    json = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on("click", function(e) {
                var nearest = turf.nearest(layer.toGeoJSON(), turf.remove(data, "title", feature.properties.title)),
                    popup = L.popup({offset: [0, -35]}).setLatLng(e.latlng),
                    content = L.Util.template(
                        "<h1>{title}</h1><p>{description}</p> \
                        <p>Nejbližší bod: {nearest}</p>", {
                        title: feature.properties.title,
                        description: feature.properties.description,
                        nearest: nearest.properties.title
                    });

                popup.setContent(content);
                popup.openOn(map);
            });

            category = feature.properties.location_type;

            if (typeof categories[category] == "undefined") {
                categories[category] = [];
            }

            categories[category].push(layer);
        },

        pointToLayer: function(feature, position) {
            return L.marker(position, {icon: L.AwesomeMarkers.icon(my.Style.set(feature.properties.location_type))});
        }
    });

    cluster = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 500
    });

    cluster.addTo(map);

    for (var category in categories) {
        overlays[my.Style.set(category).type] = L.featureGroup.subGroup(cluster, categories[category]);
    }

    mapkey = L.control.layers(null, overlays).addTo(map);

    return my;
})(M || {});
