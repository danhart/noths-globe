function buildDataVizGeometries(paths){

    var loadLayer = document.getElementById('loading');

    geoPaths.forEach(function(geoPath, index){
        var startPoint = geoPath.startPoint;
        var endPoint = geoPath.endPoint;
        geoPath.lineGeometry = makeConnectionLineGeometry(startPoint.vector, endPoint.vector);
    });

    loadLayer.style.display = 'none';
}

function getVisualizedMesh(geoPaths){
    var linesGeo = new THREE.Geometry();
    var lineColors = [];

    var particlesGeo = new THREE.Geometry();
    var particleColors = [];

    geoPaths.forEach(function(geoPath, index){
        // var lineColor = thisLineIsExport ? new THREE.Color(exportColor) : new THREE.Color(importColor);
        var lineColor = new THREE.Color(exportColor);

        var lastColor;

        //  grab the colors from the vertices
        for (s in geoPath.lineGeometry.vertices) {
            var v = geoPath.lineGeometry.vertices[s];
            lineColors.push(lineColor);
            lastColor = lineColor;
        }

        //  merge it all together
        THREE.GeometryUtils.merge(linesGeo, geoPath.lineGeometry);

        var particleColor = lastColor.clone();
        var points = geoPath.lineGeometry.vertices;

        var particleCount = constrain(geoPath.particleCount, 1, 100);
        var particleSize = constrain(geoPath.particleSize, 0.1, 60);

        for(var s = 0; s<particleCount; s++){
            var desiredIndex = s / particleCount * points.length;
            var rIndex = constrain(Math.floor(desiredIndex), 0, points.length-1);

            var point = points[rIndex];
            var particle = point.clone();

            particle.moveIndex = rIndex;
            particle.nextIndex = rIndex+1;

            if(particle.nextIndex >= points.length) {
                particle.nextIndex = 0;
            }

            particle.lerpN = 0;
            particle.path = points;
            particlesGeo.vertices.push(particle);
            particle.size = particleSize;
            particleColors.push(particleColor);
        }
    });

    linesGeo.colors = lineColors;

    //  make a final mesh out of this composite
    var splineOutline = new THREE.Line( linesGeo, new THREE.LineBasicMaterial(
        {   color: 0xffffff, opacity: 1.0, blending:
            THREE.AdditiveBlending, transparent:true,
            depthWrite: false, vertexColors: true,
            linewidth: 1 } )
    );

    splineOutline.renderDepth = false;

    attributes = {
        size: { type: 'f', value: [] },
        customColor: { type: 'c', value: [] }
    };

    uniforms = {
        amplitude: { type: "f", value: 1.0 },
        color:     { type: "c", value: new THREE.Color( 0xffffff ) },
        texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "images/particleA.png" ) },
    };

    var shaderMaterial = new THREE.ShaderMaterial( {

        uniforms:       uniforms,
        attributes:     attributes,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

        blending:       THREE.AdditiveBlending,
        depthTest:      true,
        depthWrite:     false,
        transparent:    true,
        // sizeAttenuation: true,
    });

    var particleGraphic = THREE.ImageUtils.loadTexture("images/map_mask.png");
    var particleMat = new THREE.ParticleBasicMaterial( { map: particleGraphic, color: 0xffffff, size: 60,
                                                        blending: THREE.NormalBlending, transparent:true,
                                                        depthWrite: false, vertexColors: true,
                                                        sizeAttenuation: true } );
    particlesGeo.colors = particleColors;
    var pSystem = new THREE.ParticleSystem( particlesGeo, shaderMaterial );
    pSystem.dynamic = true;
    splineOutline.add( pSystem );

    var vertices = pSystem.geometry.vertices;
    var values_size = attributes.size.value;
    var values_color = attributes.customColor.value;

    for( var v = 0; v < vertices.length; v++ ) {
        values_size[ v ] = pSystem.geometry.vertices[v].size;
        values_color[ v ] = particleColors[v];
    }

    pSystem.update = function(){
        // var time = Date.now()
        for( var i in this.geometry.vertices ){
            var particle = this.geometry.vertices[i];
            var path = particle.path;
            var moveLength = path.length;

            particle.lerpN += 0.05;

            if (particle.lerpN > 1) {
                particle.lerpN = 0;
                particle.moveIndex = particle.nextIndex;
                particle.nextIndex++;

                if ( particle.nextIndex >= path.length ) {
                    particle.moveIndex = 0;
                    particle.nextIndex = 1;
                }
            }

            var currentPoint = path[particle.moveIndex];
            var nextPoint = path[particle.nextIndex];

            particle.copy( currentPoint );
            particle.lerpSelf( nextPoint, particle.lerpN );
        }
        this.geometry.verticesNeedUpdate = true;
    };

    return splineOutline;
}

function selectVisualization(geoPaths){
    //  clear off the path's internally held color data we used from last highlight
    geoPaths.forEach(function(geoPath, index){
        geoPath.mapColor = 0;
    });

    // //  clear markers
    // for( var i in selectableCountries ){
    //     removeMarkerFromCountry( selectableCountries[i] );
    // }

    //  clear children
    while( visualizationMesh.children.length > 0 ){
        var c = visualizationMesh.children[0];
        visualizationMesh.remove(c);
    }

    //  build the mesh
    console.time('getVisualizedMesh');
    var mesh = getVisualizedMesh(geoPaths);
    console.timeEnd('getVisualizedMesh');

    //  add it to scene graph
    visualizationMesh.add( mesh );

    // Could be used to rotate to a particular point in the future
    // if( previouslySelectedCountry !== selectedCountry ){
    //     if( selectedCountry ){
    //         rotateTargetX = selectedCountry.lat * Math.PI/180;
    //         var targetY0 = -(selectedCountry.lon - 9) * Math.PI / 180;
    //         var piCounter = 0;

    //         while(true) {
    //             var targetY0Neg = targetY0 - Math.PI * 2 * piCounter;
    //             var targetY0Pos = targetY0 + Math.PI * 2 * piCounter;
    //             if(Math.abs(targetY0Neg - rotating.rotation.y) < Math.PI) {
    //                 rotateTargetY = targetY0Neg;
    //                 break;
    //             } else if(Math.abs(targetY0Pos - rotating.rotation.y) < Math.PI) {
    //                 rotateTargetY = targetY0Pos;
    //                 break;
    //             }
    //             piCounter++;
    //             rotateTargetY = wrap(targetY0, -Math.PI, Math.PI);
    //         }

    //         rotateVX *= 0.6;
    //         rotateVY *= 0.6;
    //     }
    // }
}
