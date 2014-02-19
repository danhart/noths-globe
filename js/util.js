THREE.Curve.Utils.createLineGeometry = function( points ) {
    var geometry = new THREE.Geometry();

    for( var i = 0; i < points.length; i ++ ) {
        geometry.vertices.push( points[i] );
    }

    return geometry;
};
