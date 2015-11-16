var M = (function(my) {
    var nearest = [];

    my.Infobox = L.Control.extend({
        options: {
            position: "bottomleft"
        },

        /**
         * Finds nearest point for each category.
         * @param  {array} ids
         * @return {void}
         */
        findNearestByCategory: function(categories) {
            var point = turf.point([this._latlng.lng, this._latlng.lat]),
                filtered, distance, result;

            nearest = []; // flush nearest points on each run

            for (var cat of categories) {
                filtered = turf.filter(data, "location_type", cat);

                if (filtered.features.length == 0) { // no result returned
                    continue;
                }

                result = turf.nearest(point, filtered);
                distance = turf.distance(point, result, "kilometers")
                result.properties._distance = distance.toFixed(2);

                nearest.push(result);
            }
        },

        /**
         * Creates a list of nearest points.
         * @param  {Feature.<Point>[]} points
         * @return {void}
         */
        _formatNearest: function(points) {
            var nearest = document.getElementsByClassName("vozejkmap-infobox-nearest")[0],
                heading = L.DomUtil.create("h2", "vozejkmap-infobox-nearest-heading", nearest),
                list = L.DomUtil.create("ul", "vozejkmap-infobox-nearest-list", nearest),
                self = this;

            heading.innerHTML = "Nejbližší body";

            for (var p of points) {
                var item = L.DomUtil.create("li", "vozejkmap-infobox-nearest-list-item", list),
                    icon = my.Style.get(p.properties.location_type).type.match(/^.*<\/i>/);

                item.innerHTML = [icon, p.properties.title, " (", p.properties._distance, "km)"].join("");

                L.DomEvent.addListener(item, "click", function() {
                    console.log(this.geometry.coordinates);
                    var latlng = [this.geometry.coordinates[1], this.geometry.coordinates[0]];
                    self._map.setView(latlng, 17);
                }, p);
            }
        },

        /**
         * Sets content of the infobox.
         * @param {string} content
         * @return {void}
         */
        setContent: function(content) {
            var descDiv = document.getElementsByClassName("vozejkmap-infobox-description")[0];
            descDiv.innerHTML = content;
            this._formatNearest(nearest);
        },

        /**
         * Saves latlng from the last clicked place - used for zooming to the place.
         * @param {L.latLng} latlng
         * @return void
         */
        setLatLng: function(latlng) {
            this._latlng = latlng;
        },

        onAdd: function(map) {
            var container = L.DomUtil.create("div", "vozejkmap-infobox"),
                content = L.DomUtil.create("div", "vozejkmap-infobox-content", container),
                description = L.DomUtil.create("div", "vozejkmap-infobox-description", content),
                nearest = L.DomUtil.create("div", "vozejkmap-infobox-nearest", content),
                button = L.DomUtil.create("a", "vozejkmap-infobox-close", container);

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.addListener(container, "mousewheel", function (e) {
                L.DomEvent.stopPropagation(e);
            });

            button.title = "Skrýt infobox";
            button.innerHTML = "<i class=\"fa fa-lg fa-times\"></i>";

            L.DomEvent.addListener(button, "click", function(e) {
                map.removeControl(this);
            }, this);

            this._createLocateButton(container);
            this._map = map;

            return container;
        },

        /**
         * Creates button to locate the place.
         * @param  {DOM Element} container
         * @return {void}
         */
        _createLocateButton: function(container) {
            var button = L.DomUtil.create("a", "vozejkmap-infobox-locate", container);
            button.title = "Zobrazit místo";
            button.innerHTML = "<i class=\"ion-android-locate\"></i>";

            L.DomEvent.addListener(button, "click", function(e) {
                this._map.setView(this._latlng, 17);
            }, this);
        }
    });

    return my;
})(M || {});
