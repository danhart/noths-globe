define(["lib/async"], function(async) {
    var OrderCollection = function(orders) {
        this._orders = orders;
    };

    OrderCollection.prototype.createPaths = function(callback) {
        var createPathTasks = this._orders.map(function(order) {
            return function(done) {
                order.createPath(function(err, path) {
                    callback(path);
                    done(null);
                });
            }
        });

        async.series(createPathTasks);
    };

    return OrderCollection;
});
