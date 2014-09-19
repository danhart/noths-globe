define(["lib/async", "path"], function(async, Path) {
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
        var path = new Path({
            startPoint: this.product.geo.coordinate,
            endPoint: this.geo.coordinate
        });

        this.path = path;

        path.randomParticleCount(50, 100);
        path.randomParticleSize(10, 35);
        path.randomColor();

        return path;
    };

    return Order;
});
