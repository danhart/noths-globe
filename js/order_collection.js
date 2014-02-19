define(["lib/async"], function(async) {
    var OrderCollection = function(orders) {
        this._orders = orders;
    };

    OrderCollection.prototype.createPaths = function(callback) {
        var createPathPointers = this._orders.map(function(order) {
            return order.createPath.bind(order);
        })

        async.series(createPathPointers, callback);
    };

    return OrderCollection;
});
