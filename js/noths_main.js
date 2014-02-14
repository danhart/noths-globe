(function() {
    var googleGeoCoder = {
        api: new google.maps.Geocoder(),
        locationCache: {},
        getLocation: function(address, callback) {
            var self = this;

            if (this.locationCache[address]) {
                callback(self.locationCache[address]);
                return
            }

            this.api.geocode({
                address: address
            }, function(geoData, status) {
                if (!geoData || !geoData[0] || !geoData[0].geometry) {
                    self.locationCache[address] = null;
                    callback(self.locationCache[address]);
                    return;
                }

                self.locationCache[address] = geoData[0].geometry.location;
                callback(self.locationCache[address]);
            });
        }
    }

    var OrdersApi = {
        get: function(callback) {
            $.ajax({
                url: "/noths_order_geo",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    callback(data);
                }
            });
        },
        getLoop: function(callback) {
            var self = this;

            setInterval(function() {
                self.get(function(newOrders) {
                    callback(newOrders);
                });
            }, 5000);
        }
    };


    var OrderPathBuilder = function() {
        var PATH_COLORS = [
            0xdd380c, // Red
            0x3dba00, // Green
            0x154492, // Blue
            0xe011cf, // Purple
            0xe29d08  // Orange
        ];

        var OrderPathBuilder = function(order, geocoder) {
            this.order = order;
            this.geocoder = geocoder;
        };

        OrderPathBuilder.prototype.create = function(callback) {
            var self = this;

            getCoordinates.call(this, function(coordinates) {
                if (!coordinates) {
                    callback(null);
                    return;
                }
                console.log(self.order.product.imageURL.mini);

                callback({
                    startPoint: {
                        coordinate: coordinates[0]
                    },
                    endPoint: {
                        coordinate: coordinates[1],
                        marker: $("<div />", {
                            "class": "end_point_marker marker",
                            "text":  self.order.product.title
                        }).append('<img class="marker_image" src="http://www.notonthehighstreet.com' + self.order.product.imageURL.mini + '"/>')
                    },
                    particleCount: randomParticleCount(),
                    particleSize: randomParticleSize(),
                    color: randomColor()
                })
            });
        };

        var randomParticleCount = function() {
            return randBetweenRange(5, 200);
        };

        var randomParticleSize = function() {
            return randBetweenRange(10, 500);
        };

        var randomColor = function() {
            return PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
        };

        var randBetweenRange = function(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        };

        var getCoordinates = function(callback) {
            var self = this;

            var startAddress = this.order.product.geo.place +
                               ', ' +
                               this.order.product.geo.county +
                               ', ' +
                               this.order.product.geo.country;

            startAddress = startAddress.replace(/ ,/, "");

            var endAddress = this.order.geo.place +
                             ', ' +
                             this.order.geo.county +
                             ', ' +
                             this.order.geo.country;

            endAddress = endAddress.replace(/ ,/, "");

            self.geocoder.getLocation(startAddress, function(startLocation) {
                self.geocoder.getLocation(endAddress, function(endLocation) {
                    if (!startLocation || !endLocation) {
                        callback(null);
                        return;
                    }

                    callback([
                        {
                            lat: startLocation.lat(),
                            lon: startLocation.lng()
                        },
                        {
                            lat: endLocation.lat(),
                            lon: endLocation.lng()
                        }
                    ])
                });
            });
        };

        return OrderPathBuilder;
    }();

    var convertOrdersToPaths = function(counter, orders, paths, callback) {
        if (orders.length == counter + 1) {
            callback(paths);
            return;
        }

        new OrderPathBuilder(orders[counter], googleGeoCoder).create(function(path) {
            if (path) paths.push(path);

            counter++;
            convertOrdersToPaths(counter, orders, paths, callback);
        });
    };

    GlobePaths.start(function() {
        OrdersApi.getLoop(function(orders) {
            convertOrdersToPaths(0, orders, [], function(paths) {
                GlobePaths.setPaths(paths);
            });
        });
    });
})();
