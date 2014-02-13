(function() {
    var OrdersApi = {
        get: function(orders) {
            $.ajax({
                url: "/map",
                data: { last_order_id: this.last_order_id },
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    this.last_order_id = data.last_order_id;
                    orders(data.products);
                }
            });
        },
    }

    orders = [];
    setInterval(function() {
        OrdersApi.get(function(newOrders) {
            orders.contact(newOrders);
            orders = orders.slice(-20);
        });
    }, 5000);

    var pathColors = [
        0xdd380c,
        0x154492,
        0xdd380c,
        0x3dba00,
        0x154492
    ]

    var newPaths = [
        {
            startPoint: {
                // DE
                coordinate: {
                    lat: 51,
                    lon: 9
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 38,
                    lon: -97
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[3]
        },
        {
            startPoint: {
                // DE
                coordinate: {
                    lat: 51,
                    lon: 9
                }
            },
            endPoint: {
                // JP
                coordinate: {
                    lat: 36,
                    lon: 138
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[4]
        }
    ];

    var geoPaths = [
        {
            startPoint: {
                // GB
                coordinate: {
                    lat: 54,
                    lon: -2
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 38,
                    lon: -97
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[1]
        },
        {
            startPoint: {
                // GB
                coordinate: {
                    lat: 54,
                    lon: -2
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 59,
                    lon: 50
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[0]
        }
    ];

    // GlobePaths.addPath(paths);
    // GlobePaths.removePath(index);
    GlobePaths.start(function() {
        var paths;

        setInterval(function() {
            if (paths == geoPaths) {
                paths = newPaths;
            } else {
                paths = geoPaths;
            }

            GlobePaths.setPaths(paths);
        }, 5000);
    });
})();
