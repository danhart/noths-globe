define(function() {
    var randBetweenRange = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    var PATH_COLORS = [
        0xdd380c, // Red
        0x3dba00, // Green
        0x154492, // Blue
        0xe011cf, // Purple
        0xe29d08  // Orange
    ];

    var Path = function() {
        this.startPoint = {};
        this.endPoint = {};
    };

    Path.prototype.randomParticleCount = function() {
        this.particleCount = randBetweenRange(5, 100);
    };

    Path.prototype.randomParticleSize = function() {
        this.particleSize = randBetweenRange(5, 50);
    };

    Path.prototype.randomColor = function() {
        this.color = PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
    };

    return Path;
});
