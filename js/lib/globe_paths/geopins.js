function addVectorsToGeoPaths(paths) {
    paths.forEach(function(geoPath, index){
        var startPoint = geoPath.startPoint;
        var endPoint = geoPath.endPoint;

        if (startPoint.vector && endPoint.vector) return;

        startPoint.vector = vectorFromCoordinate(startPoint.coordinate);
        endPoint.vector = vectorFromCoordinate(endPoint.coordinate);
    });
}

function vectorFromCoordinate(coordinate) {
    var rad=1;

    var lon = coordinate.lon - 90;
    var lat = coordinate.lat;

    var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

    var vector = new THREE.Vector3();
    vector.x = Math.sin(phi) * Math.cos(theta) * rad;
    vector.y = Math.cos(phi) * rad;
    vector.z = Math.sin(phi) * Math.sin(theta) * rad;

    // console.log(vector.x);
    // console.log(vector.y);
    // console.log(vector.z);

    return vector;
}
