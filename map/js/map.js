var M = (function(my) { "use strict";
    var basemap = L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"),
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

    map.on("locationerror", function(e) {
        console.log(e);
    })

    json = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on("click", function(e) {

                var nearest = turf.nearest(layer.toGeoJSON(), turf.remove(data, "title", feature.properties.title)),
                    content = L.Util.template(
                        "<h1>{title}</h1> \
                        <p>{description}</p>", {
                        title: feature.properties.title,
                        description: feature.properties.description,
                    });

                try {
                    map.removeControl(infobox);
                } catch (e) {
                    // control not added yet
                };

                infobox.setLatLng(e.latlng);
                map.addControl(infobox);
                infobox.findNearestByCategory(my.Style.getTypedIds());
                infobox.setContent(content);
            });

            category = feature.properties.location_type;

            if (typeof categories[category] == "undefined") {
                categories[category] = [];
            }

            categories[category].push(layer);
        },

        pointToLayer: function(feature, position) {
            return L.marker(position, {icon: L.AwesomeMarkers.icon(my.Style.get(feature.properties.location_type))});
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
        var type = my.Style.get(category).type;
        overlays[type] = L.featureGroup.subGroup(cluster, categories[category]);
        overlays[type].addTo(map);
    }

    cluster.addTo(map);

    mapkey = L.control.layers(null, overlays).addTo(map);

    return my;
})(M || {});
