var M = (function(my) {
    my.Infobox = L.Control.extend({
        options: {
            position: "bottomleft"
        },

        /**
         * Sets content of the infobox.
         * @param {string} content
         * @return {void}
         */
        setContent: function(content) {
           document.getElementsByClassName("vozejkmap-infobox-content")[0].innerHTML = content;
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
                button = L.DomUtil.create("a", "vozejkmap-infobox-close", container);

            L.DomEvent.disableClickPropagation(container);

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
