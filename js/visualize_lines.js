var globeRadius = 1000;
var vec3_origin = new THREE.Vector3(0,0,0);

function makeConnectionLineGeometry(start, end){
    var distanceBetweenCountryCenter = start.clone().sub(end).length();

    //  how high we want to shoot the curve upwards
    var anchorHeight = globeRadius + distanceBetweenCountryCenter * 0.7;

    //  midpoint for the curve
    var mid = start.clone().lerp(end,0.5);
    var midLength = mid.length()
    mid.normalize();
    mid.multiplyScalar( midLength + distanceBetweenCountryCenter * 0.7 );

    //  the normal from start to end
    var normal = (new THREE.Vector3()).sub(start,end);
    normal.normalize();

    /*
                The curve looks like this:

                midStartAnchor---- mid ----- midEndAnchor
              /                                           \
             /                                             \
            /                                               \
    start/anchor                                         end/anchor

        splineCurveA                            splineCurveB
    */

    var distanceHalf = distanceBetweenCountryCenter * 0.5;

    var startAnchor = start;
    var midStartAnchor = mid.clone().add( normal.clone().multiplyScalar( distanceHalf ) );
    var midEndAnchor = mid.clone().add( normal.clone().multiplyScalar( -distanceHalf ) );
    var endAnchor = end;

    //  now make a bezier curve out of the above like so in the diagram
    var splineCurveA = new THREE.CubicBezierCurve3( start, startAnchor, midStartAnchor, mid);
    // splineCurveA.updateArcLengths();

    var splineCurveB = new THREE.CubicBezierCurve3( mid, midEndAnchor, endAnchor, end);
    // splineCurveB.updateArcLengths();

    //  how many vertices do we want on this guy? this is for *each* side
    var vertexCountDesired = Math.floor( /*splineCurveA.getLength()*/ distanceBetweenCountryCenter * 0.02 + 6 ) * 2;

    //  collect the vertices
    var points = splineCurveA.getPoints( vertexCountDesired );

    //  remove the very last point since it will be duplicated on the next half of the curve
    points = points.splice(0,points.length-1);

    points = points.concat( splineCurveB.getPoints( vertexCountDesired ) );

    //  add one final point to the center of the earth
    //  we need this for drawing multiple arcs, but piled into one geometry buffer
    points.push( vec3_origin );

    //  create a line geometry out of these
    var curveGeometry = THREE.Curve.Utils.createLineGeometry( points );

    return curveGeometry;
}

function constrain(v, min, max){
    if( v < min )
        v = min;
    else
    if( v > max )
        v = max;
    return v;
}
