define(function() {
    return {
        _paths: [],
        push: function(path) {
            this._paths.push(path);
            if (this._paths.length > 50) this._paths.shift();
        },
        getData: function() {
            return this._paths;
        }
    };
});
