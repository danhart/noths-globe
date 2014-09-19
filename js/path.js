define(function() {
    var randBetweenRange = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    // TODO: This color stuff should be moved into Order
    var PATH_COLORS = [
        {
            // Red
            dark:  0x5b1907,
            light: "#e84012"
        },
        {
            // Green
            dark:  0x1b4905,
            light: "#54df11"
        },
        {
            // Blue
            dark:  0x154492,
            light: "#1462e4"
        },
        {
            // Purple
            dark:  0x9b0e8f,
            light: "#eb16d9"
        },
        {
            // Orange
            dark:  0xa4740c,
            light: "#ffae00"
        },
        {
            // Yellow
            dark:  0x4c4809,
            light: "#fff000"
        },
        {
            // Awesome light yellow colour
            dark:  0x676546,
            light: "#fdf9b9"
        },
        {
            // Turquoise
            dark:  0x084149,
            light: "#09d9f6"
        }
    ];

    var Path = function(pathData) {
        this.startPoint = {
            coordinate: {
                lat: parseFloat(pathData.startPoint.lat),
                lon: parseFloat(pathData.startPoint.lon)
            }
        };

        this.endPoint = {
            coordinate: {
                lat: parseFloat(pathData.endPoint.lat),
                lon: parseFloat(pathData.endPoint.lon)
            }
        };
    };

    Path.prototype.setup = function() {
        this.randomParticleCount();
        this.randomParticleSize();
        this.randomColor();
    };

    Path.prototype.randomParticleCount = function() {
        this.particleCount = randBetweenRange(5, 10);
    };

    Path.prototype.randomParticleSize = function() {
        this.particleSize = randBetweenRange(30, 30);
    };

    Path.prototype.randomColor = function() {
        var pathColor = PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
        this.color = pathColor.dark;
        this.lightColor = pathColor.light;
    };

    return Path;
});
