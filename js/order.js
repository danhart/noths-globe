define(["lib/async", "geo_service", "path"], function(async, geoService, Path) {
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

        async.mapSeries([senderAddress, deliveryAddress], geoService.getLocation.bind(geoService), function(err, coordinates) {
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

    return Order;
});
