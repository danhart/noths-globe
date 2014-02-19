define(function() {
    return {
        api: new google.maps.Geocoder(),
        locationCache: {},
        getLocation: function(address, callback) {
            var self = this;

            if (this.locationCache[address]) {
                callback(null, self.locationCache[address]);
                return;
            }

            if (this.locationCache[address] === null) {
                callback("cannot lookup address data");
                return;
            }

            this.api.geocode({
                address: address
            }, function(geoData, status) {
                if (!geoData || !geoData[0] || !geoData[0].geometry) {
                    console.log(status);
                    self.locationCache[address] = null;
                    callback("cannot lookup address data");
                    return;
                }

                self.locationCache[address] = geoData[0].geometry.location;

                // We throttle the return of this otherwise google complains with a OVER_QUERY_LIMIT status
                setTimeout(function() {
                    callback(null, self.locationCache[address]);
                }, 800);
            });
        }
    };
});
