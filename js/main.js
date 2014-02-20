require(["lib/socket.io", "path_collection", "order", "order_collection", "hud"], function(io, pathCollection, Order, OrderCollection, hud) {
    var socket = io.connect('http://85.17.23.72:10052', {
        resource: 'noths_order_geo/socket.io'
    });

    var setGlobePosition = function() {
        if (hud.isOpen()) {
            GlobePaths.getCamera().position.x += 0.4
        } else {
            GlobePaths.getCamera().position.x -= 0.4
        }
    };

    GlobePaths.start({});
    setGlobePosition();

    hud.on("toggle", function() {
        setGlobePosition();
    });

    socket.on('intl_orders', function(ordersData) {
        var orders = ordersData.map(function(orderData) {
            return new Order(orderData);
        });

        var orderCollection = new OrderCollection(orders);

        orderCollection.createPaths(function(err, paths) {
            orders.forEach(function(order) {
                if (order.path) hud.addOrder(order);
            });

            paths.forEach(function(path) {
                if (path) {
                    pathCollection.push(path);
                }
            });

            GlobePaths.setPaths(pathCollection.getData());
        });
    });
});
