(function() {
    var googleGeoCoder = {
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
                    self.locationCache[address] = null;
                    callback("cannot lookup address data");
                    return;
                }

                self.locationCache[address] = geoData[0].geometry.location;

                // We throttle the return of this otherwise google complains with a OVER_QUERY_LIMIT status
                setTimeout(function() {
                    callback(null, self.locationCache[address]);
                }, 500);
            });
        }
    };

    var pathCollection = {
        _paths: [],
        push: function(path) {
            this._paths.push(path);
            if (this._paths.length > 20) this._paths.shift();
        },
        getData: function() {
            return this._paths;
        }
    };

    var randBetweenRange = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    var PATH_COLORS = [
        0xdd380c, // Red
        0x3dba00, // Green
        0x154492, // Blue
        0xe011cf, // Purple
        0xe29d08  // Orange
    ];

    var Path = function() {
        this.startPoint = {};
        this.endPoint = {};
    };

    Path.prototype.randomParticleCount = function() {
        this.particleCount = randBetweenRange(5, 200);
    };

    Path.prototype.randomParticleSize = function() {
        this.particleSize = randBetweenRange(10, 500);
    };

    Path.prototype.randomColor = function() {
        this.color = PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
    };

    var Order = function(orderData) {
        this.geo = orderData.geo;
        this.product = orderData.product;
    };

    Order.prototype.getDeliveryAddress = function() {
        var deliveryAddress = this.geo.place +
            ', ' +
            this.geo.county +
            ', ' +
            this.geo.country;

        deliveryAddress = deliveryAddress.replace(/ ,/, '');
        deliveryAddress = deliveryAddress.replace(/,,/, ',');

        return deliveryAddress;
    };

    Order.prototype.getSenderAddress = function() {
        var senderAddress = this.product.geo.place +
            ', ' +
            this.product.geo.county +
            ', ' +
            this.product.geo.country;

        senderAddress = senderAddress.replace(/ ,/, '');
        senderAddress = senderAddress.replace(/,,/, ',');

        return senderAddress;
    };

    // Async
    Order.prototype.createPath = function(callback) {
        var deliveryAddress = this.getDeliveryAddress();
        var senderAddress = this.getSenderAddress();

        async.mapSeries([senderAddress, deliveryAddress], googleGeoCoder.getLocation.bind(googleGeoCoder), function(err, coordinates) {
            if (err) {
                callback(null, null);
                return;
            }

            var path = new Path();

            path.randomParticleCount();
            path.randomParticleSize();
            path.randomColor();

            path.startPoint.coordinate = {
                lat: coordinates[0].lat(),
                lon: coordinates[0].lng()
            }

            path.endPoint.coordinate = {
                lat: coordinates[1].lat(),
                lon: coordinates[1].lng()
            };

            callback(null, path);
        });
    };

    var OrderCollection = function(orders) {
        this._orders = orders;
    };

    OrderCollection.prototype.createPaths = function(callback) {
        var createPathPointers = this._orders.map(function(order) {
            return order.createPath.bind(order);
        })

        async.series(createPathPointers, callback);
    };

    var socket = io.connect('http://85.17.23.72:10052', {
        resource: 'noths_order_geo/socket.io'
    });

    // TODO: Move this state into the GlobePaths plugin and add an event for
    // Globe Ready.
    var globeStarted = false;

    GlobePaths.start(function() {
        globeStarted = true;
    });

    socket.on('intl_orders', function(ordersData) {
        var orders = ordersData.map(function(orderData) {
            return new Order(orderData);
        });

        var orderCollection = new OrderCollection(orders);

        orderCollection.createPaths(function(err, paths) {
            paths.forEach(function(path) {
                if (path) pathCollection.push(path);
            });

            if (globeStarted) GlobePaths.setPaths(pathCollection.getData());
        });
    });
})();
