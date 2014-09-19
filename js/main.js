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
            path.randomParticleCount(1, 1);
            path.randomParticleSize(30, 30);
            path.randomColor();

            return path;
        });

        GlobePaths.setPaths(paths);
    };

    // Could be localstorage
    var yearPathsCache = {};

    $(".filter_button").click(function(e) {
        e.preventDefault();
        $(this).addClass("active").siblings().removeClass("active");

        if ($(this).hasClass("live")) {
            GlobePaths.setPaths(pathCollection.getData());
        }

        if (!$(this).data('year')) return;
        var year = $(this).data('year');
        var data;

        if (yearPathsCache[year]) {
            setPaths(yearPathsCache[year]);
            return;
        }

        $.get('js/paths' + year + '.json', function(paths) {
            yearPathsCache[year] = paths;
            setPaths(yearPathsCache[year]);
        });
    });

    hud.on("restrict", function() {
        var paths = hud.getHighlightedOrders().map(function(order) {
            return order.path;
        });

        $(".filter_button.live").addClass("active").siblings().removeClass("active");
        GlobePaths.setPaths(paths);
    });

    hud.on("unrestrict", function() {
        $(".filter_button.live").addClass("active").siblings().removeClass("active");
        GlobePaths.setPaths(pathCollection.getData());
    });

    socket.on('order', function(orderData) {
        // Filter out orders that don't have coordinate data
        if (!orderData.product.geo.coordinate) return;
        if (!orderData.geo.coordinate) return;

        var order = new Order(orderData);

        var orderCollection = new OrderCollection([order]);
        var paths = orderCollection.createPaths();

        hud.addOrder(order);
        pathCollection.push(paths[0]);

        if (!hud.restricted) {
            GlobePaths.setPaths(pathCollection.getData());
        }
    });
});
