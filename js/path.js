define(function() {
    var randBetweenRange = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    var PATH_COLORS = [
        0x5b1907, // Red
        0xa21111, // Blood red
        0x1b4905, // Green
        0x043e24, // Mint green
        0x154492, // Blue
        0x084149, // Turquoise
        0x9b0e8f, // Purple
        0xa4740c, // Orange
        0x4c4809, // Yellow
        0x676546  // Awesome light yellow colour
    ];

    var Path = function() {
        this.startPoint = {};
        this.endPoint = {};
    };

    Path.prototype.randomParticleCount = function() {
        this.particleCount = randBetweenRange(50, 100);
    };

    Path.prototype.randomParticleSize = function() {
        this.particleSize = randBetweenRange(10, 35);
    };

    Path.prototype.randomColor = function() {
        this.color = PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
    };

    return Path;
});
