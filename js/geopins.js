function loadGeoData(latlonData){
    var rad=100;

    for(var i in latlonData.countries){
        var country = latlonData.countries[i];
        country.countryCode = i;
        country.countryName = countryLookup[i];

        var lon = country.lon - 90;
        var lat = country.lat;

        var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
        var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

        var center = new THREE.Vector3();
        center.x = Math.sin(phi) * Math.cos(theta) * rad;
        center.y = Math.cos(phi) * rad;
        center.z = Math.sin(phi) * Math.sin(theta) * rad;

        country.center = center;

        countryData[country.countryName] = country;
    }
}

function addVectorsToGeoPaths() {
    geoPaths.forEach(function(geoPath, index){
        var startPoint = geoPath.startPoint;
        var endPoint = geoPath.endPoint;

        startPoint.vector = vectorFromCoordinate(startPoint.coordinate);
        endPoint.vector = vectorFromCoordinate(endPoint.coordinate);
    });
}

function vectorFromCoordinate(coordinate) {
    var rad=100;

    var lon = coordinate.lon - 90;
    var lat = coordinate.lat;

    var phi = Math.PI / 2 - lat * Math.PI / 180 - Math.PI * 0.01;
    var theta = 2 * Math.PI - lon * Math.PI / 180 + Math.PI * 0.06;

    var vector = new THREE.Vector3();
    vector.x = Math.sin(phi) * Math.cos(theta) * rad;
    vector.y = Math.cos(phi) * rad;
    vector.z = Math.sin(phi) * Math.sin(theta) * rad;

    console.log(vector.x);
    console.log(vector.y);
    console.log(vector.z);

    return vector;
}

function getCountry(name){
    return countryData[name.toUpperCase()]
}
