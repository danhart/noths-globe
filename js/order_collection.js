define(["lib/async"], function(async) {
    var OrderCollection = function(orders) {
        this._orders = orders;
    };

    OrderCollection.prototype.createPaths = function(callback) {
        var paths = this._orders.map(function(order) {
            return order.createPath();
        });

        return paths;
    };

    return OrderCollection;
});
