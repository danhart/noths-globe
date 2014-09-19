require(["lib/socket.io", "path_collection", "order", "order_collection", "hud", "path"], function(io, pathCollection, Order, OrderCollection, hud, Path) {
    var socket = io.connect('http://159.253.142.200:10052', {
        resource: 'noths_order_geo/socket.io'
    });

    var setGlobePosition = function() {
        if (hud.isOpen()) {
            GlobePaths.getCamera().position.x += 0.4;
        } else {
            GlobePaths.getCamera().position.x -= 0.4;
        }
    };

    GlobePaths.start({});
    setGlobePosition();

    socket.emit('order-query', {
        last: 100,
        international: true
    });

    hud.on("toggle", function() {
        setGlobePosition();
    });

    var setPaths = function(paths) {
        paths = paths.filter(function(pathData) {
            return pathData && pathData.startPoint && pathData.endPoint;
        });

        paths = paths.filter(function(path) {
            return !isNaN(path.startPoint.lat) && !isNaN(path.startPoint.lon) && !isNaN(path.endPoint.lat) && !isNaN(path.endPoint.lon);
        });

        paths = paths.map(function(pathData) {
            path = new Path(pathData);
            path.setup();

            return path;
        });

        GlobePaths.setPaths(paths);
    };

    var paths2010, paths2009, paths2008;

    $.get('js/paths2010.json', function(paths) {
        paths2010 = paths;
    });

    $.get('js/paths2009.json', function(paths) {
        paths2009 = paths;
    });

    $.get('js/paths2008.json', function(paths) {
        paths2008 = paths;
    });

    $(".2008").click(function(e) {
        e.preventDefault();
        setPaths(paths2008);
    });

    $(".2009").click(function(e) {
        e.preventDefault();
        setPaths(paths2009);
    });

    $(".2010").click(function(e) {
        e.preventDefault();
        setPaths(paths2010);
    });


    hud.on("restrict", function() {
        var paths = hud.getHighlightedOrders().map(function(order) {
            return order.path;
        });

        GlobePaths.setPaths(paths);
    });

    hud.on("unrestrict", function() {
        GlobePaths.setPaths(pathCollection.getData());
    });

    // socket.on('order', function(orderData) {
    //     // Filter out orders that don't have coordinate data
    //     if (!orderData.product.geo.coordinate) return;
    //     if (!orderData.geo.coordinate) return;

    //     var order = new Order(orderData);

    //     var orderCollection = new OrderCollection([order]);
    //     var paths = orderCollection.createPaths();

    //     hud.addOrder(order);
    //     pathCollection.push(paths[0]);

    //     if (!hud.restricted) {
    //         GlobePaths.setPaths(pathCollection.getData());
    //     }
    // });
});
