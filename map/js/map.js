var M = (function(my) { "use strict";
    var basemap, cluster, json, map, styles;
    my.version = "0.0.3";

    basemap = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");

    map = L.map("map", {
        center: [49.805, 15.48],
        layers: [basemap],
        zoom: 8,
    });

    styles = {
        "1": { // culture
            "icon": "video-camera",
            "markerColor": "blue",
            "prefix": "fa"
        },
        "2": { // sports
            "icon": "ios7-football",
            "markerColor": "darkgreen",
            "prefix": "ion"
        },
        "3": { // institutions
            "icon": "institution",
            "markerColor": "gray",
            "prefix": "fa"
        },
        "4": { // food and drink
            "icon": "glass",
            "markerColor": "orange",
            "prefix": "fa"
        },
        "5": { // acommodation
            "icon": "bed",
            "prefix": "fa"
        },
        "6": { // health care
            "icon": "heartbeat",
            "markerColor": "red",
            "prefix": "fa"
        },
        "7": { // other
            "icon": "more",
            "prefix": "ion"
        },
        "8": { // transportation
            "icon": "road",
            "markerColor": "gray",
            "prefix": "glyphicon"
        },
        "9": { // public toilets
            "icon": "venus-mars",
            "iconColor": "black",
            "markerColor": "white",
            "prefix": "fa"
        },
        "10": { // gas station
            "icon": "tint",
            "markerColor": "darkpurple",
            "prefix": "fa"
        },
        "11": { // shopping
            "icon": "ios7-cart",
            "markerColor": "green",
            "prefix": "ion"
        },
        "12": { // banks, ATMs
            "icon": "social-usd",
            "markerColor": "green",
            "prefix": "ion"
        },
        "13": { // parking lots
            "icon": "heart",
            "markerColor": "gray",
            "prefix": "ion"
        },
        "14": { // Škoda auto (wtf?!)
            "icon": "car",
            "markerColor": "gray",
            "prefix": "fa"
        }
    };

    json = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup(L.Util.template("<h1>{title}</h1><p>{description}</p>", {
                title: feature.properties.title,
                description: feature.properties.description
            }));
        },
        pointToLayer: function(feature, position) {
            return L.marker(position, {icon: L.AwesomeMarkers.icon(styles[feature.properties.location_type])});
        }
    });

    cluster = L.markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 500
    });
    cluster.addLayer(json).addTo(map);

    return my;
})({});