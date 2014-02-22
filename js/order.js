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
    Order.prototype.createPath = function() {
        var path = new Path();
        this.path = path;

        path.randomParticleCount();
        path.randomParticleSize();
        path.randomColor();

        path.startPoint.coordinate = this.product.geo.coordinate;
        path.endPoint.coordinate = this.geo.coordinate;

        return path;
    };

    return Order;
});
