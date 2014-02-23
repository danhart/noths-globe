define(function() {
    var randBetweenRange = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    var PATH_COLORS = [
        0xdd380c, // Red
        0xdd0c0c, // Blood red
        0xa21111, // Blood red darker
        0x3dba00, // Green
        0x00ba65, // Mint green
        0x154492, // Blue
        0x158292, // Turquoise
        0xe011cf, // Purple
        0x9b0e8f, // Purple darker
        0xe29d08, // Orange
        0xa4740c, // Orange darker
        0xbfb40a  // Yellow
    ];

    var Path = function() {
        this.startPoint = {};
        this.endPoint = {};
    };

    Path.prototype.randomParticleCount = function() {
        this.particleCount = randBetweenRange(5, 150);
    };

    Path.prototype.randomParticleSize = function() {
        this.particleSize = randBetweenRange(10, 40);
    };

    Path.prototype.randomColor = function() {
        this.color = PATH_COLORS[Math.floor(Math.random() * PATH_COLORS.length)];
    };

    return Path;
});
