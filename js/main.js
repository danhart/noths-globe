require(["lib/socket.io", "path_collection", "order", "order_collection"], function(io, pathCollection, Order, OrderCollection) {
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
});
