var M = (function(my) { "use strict";
    var basemap = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png"),
        categories = {},
        cluster,
        infobox = new my.Infobox(),
        json,
        map,
        mapkey,
        overlays = {};

    my.version = "1.0";

    map = L.map("map", {
        center: [49.805, 15.48],
        layers: [basemap],
        zoom: 8
    });

    // try to locate the user
    map.locate({
        setView: true,
        enableHighAccuracy: true
    });

    map.on("locationfound", function(e) {
        // gps accuracy
        L.circle(e.latlng, e.accuracy, {
            fillColor: "#4096EE",
            fillOpacity: 0.1,
            weight: 1
        }).addTo(map);

        // gps location
        L.circleMarker(e.latlng, {
            fillColor: "#4096EE",
            fillOpacity: 1,
            weight: 1
        }).setRadius(5).addTo(map);
    });

    json = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on("click", function(e) {
                var nearest = turf.nearest(layer.toGeoJSON(), turf.remove(data, "title", feature.properties.title)),
                    distance = turf.distance(layer.toGeoJSON(), nearest, "kilometers").toPrecision(2),
                    popup = L.popup({offset: [0, -35]}).setLatLng(e.latlng),
                    content = L.Util.template(
                        "<h1>{title}</h1> \
                        <p>{description}</p> \
                        <p>Nejbližší bod: {nearest} je {distance} km daleko.</p>", {
                        title: feature.properties.title,
                        description: feature.properties.description,
                        nearest: nearest.properties.title,
                        distance: distance
                    });

                try {
                    map.removeControl(infobox);
                } catch (e) {
                    // control not added yet
                };

                infobox.setLatLng(e.latlng);
                map.addControl(infobox);
                infobox.setContent(content);
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
        disableClusteringAtZoom: 16,
        chunkedLoading: true,
        chunkInterval: 500,
        polygonOptions: {
            color: "#FF1A00",
            weight: 1
        }
    });

    for (var category in categories) {
        overlays[my.Style.set(category).type] = L.featureGroup.subGroup(cluster, categories[category]);
        overlays[my.Style.set(category).type].addTo(map);
    }

    cluster.addTo(map);

    mapkey = L.control.layers(null, overlays).addTo(map);

    return my;
})(M || {});
