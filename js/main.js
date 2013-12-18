var masterContainer = document.getElementById('visualization');

var overlay = document.getElementById('visualization');

var mapIndexedImage;
var mapOutlineImage;

//  where in html to hold all our things
var glContainer = document.getElementById( 'glContainer' );

//  contains a list of country codes with their matching country names
var isoFile = 'country_iso3166.json';
var latlonFile = 'country_lat_lon.json'

var camera, scene, renderer, controls;

var pinsBase, pinsBaseMat;
var lookupCanvas
var lookupTexture;
var backTexture;
var worldCanvas;
var sphere;
var rotating;
var visualizationMesh;

var mapUniforms;

//  contains the data loaded from the arms data file
//  contains a list of years, followed by trades within that year
//  properties for each "trade" is: e - exporter, i - importer, v - value (USD), wc - weapons code (see table)
var timeBins;

//  contains latlon data for each country
var latlonData;

//  contains above but organized as a mapped list via ['countryname'] = countryobject
//  each country object has data like center of country in 3d space, lat lon, country name, and country code
var countryData = {};

// These are the points on the globe. There is one geoPin per coordinate. Each
// geoPin has a vector in 3d space, i.e. geoPin.vector. Also lat/lon etc.
var geoPins;
var geoPaths;

//  contains a list of country code to country name for running lookups
var countryLookup;

var selectableCountries = [];

/*
    930100 â€“ military weapons, and includes some light weapons and artillery as well as machine guns and assault rifles etc.
    930190 â€“ military firearms â€“ eg assault rifles, machineguns (sub, light, heavy etc), combat shotguns, machine pistols etc
    930200 â€“ pistols and revolvers
    930320 â€“ Sporting shotguns (anything that isnâ€™t rated as a military item).
    930330 â€“ Sporting rifles (basically anything that isnâ€™t fully automatic).
    930621 â€“ shotgun shells
    930630 â€“ small caliber ammo (anything below 14.5mm which isnâ€™t fired from a shotgun.
*/

//  a list of weapon 'codes'
//  now they are just strings of categories
//  Category Name : Category Code
var weaponLookup = {
    'Military Weapons'      : 'mil',
    'Civilian Weapons'      : 'civ',
    'Ammunition'            : 'ammo',
};

//  a list of the reverse for easy lookup
var reverseWeaponLookup = new Object();
for( var i in weaponLookup ){
    var name = i;
    var code = weaponLookup[i];
    reverseWeaponLookup[code] = name;
}

var pathColors = [
    0xdd380c,
    0x154492,
    0xdd380c,
    0x3dba00,
    0x154492
]

//  the currently selected country
var selectedCountry = null;
var previouslySelectedCountry = null;

//  contains info about what year, what countries, categories, etc that's being visualized
var selectionData;

//  when the app is idle this will be true
var idle = false;

//  for svg loading
//  deprecated, not using svg loading anymore
var assetList = [];

//  TODO
//  use underscore and ".after" to load these in order
//  don't look at me I'm ugly
//
function start( e ){
    // loadCountryCodes(function(){
        loadWorldPins(function(){
            loadContentData(function(){
                initScene();
                animate();
            });
        });
    // });
}

function geoPathsUpdated() {
    geoPaths = [
        {
            startPoint: {
                // DE
                coordinate: {
                    lat: 51,
                    lon: 9
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 38,
                    lon: -97
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[3]
        },
        {
            startPoint: {
                // DE
                coordinate: {
                    lat: 51,
                    lon: 9
                }
            },
            endPoint: {
                // JP
                coordinate: {
                    lat: 36,
                    lon: 138
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[4]
        }
    ];

    // New
    addVectorsToGeoPaths();

    console.time('buildDataVizGeometries');
    buildDataVizGeometries(geoPaths);
    console.timeEnd('buildDataVizGeometries');

    selectVisualization(geoPaths);
}

//  -----------------------------------------------------------------------------
//  All the initialization stuff for THREE
function initScene() {

    //  -----------------------------------------------------------------------------
    //  Let's make a scene
    scene = new THREE.Scene();
    scene.matrixAutoUpdate = false;

    scene.add( new THREE.AmbientLight( 0xFFFFFF ) );

    var light   = new THREE.DirectionalLight( 0xcccccc, 1 )
    light.position.set(5,5,5);
    scene.add( light );
    light.castShadow    = true;
    light.shadowCameraNear  = 0.01;
    light.shadowCameraFar   = 15;
    light.shadowCameraFov   = 45;

    light.shadowCameraLeft  = -1;
    light.shadowCameraRight =  1;
    light.shadowCameraTop   =  1;
    light.shadowCameraBottom= -1;
    // light.shadowCameraVisible    = true;

    light.shadowBias    = 0.001;
    light.shadowDarkness    = 0.2;

    light.shadowMapWidth    = 1024*2;
    light.shadowMapHeight   = 1024*2;

    rotating = new THREE.Object3D();
    scene.add(rotating);

    // For the globe
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('images/earthbump1k.jpg'),
        bumpScale: 1,
        specularMap: THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
        specular: new THREE.Color('grey'),
    })

    //  -----------------------------------------------------------------------------
    //  Create the backing (sphere)
    sphere = new THREE.Mesh( new THREE.SphereGeometry( 100, 40, 40 ), material );

    sphere.rotation.x = Math.PI;
    sphere.rotation.y = -Math.PI/2;
    sphere.rotation.z = Math.PI;
    sphere.id = "base";
    rotating.add( sphere );

    // load geo data (country lat lons in this case)
    // console.time('loadGeoData');
    // loadGeoData( latlonData );
    // console.timeEnd('loadGeoData');

    geoPaths = [
        {
            startPoint: {
                // GB
                coordinate: {
                    lat: 54,
                    lon: -2
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 38,
                    lon: -97
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[1]
        },
        {
            startPoint: {
                // GB
                coordinate: {
                    lat: 54,
                    lon: -2
                }
            },
            endPoint: {
                // US
                coordinate: {
                    lat: 59,
                    lon: 50
                }
            },
            particleCount: 50,
            particleSize: 60,
            color: pathColors[0]
        }
    ];

    // New
    addVectorsToGeoPaths();
    console.log(geoPaths);

    console.time('buildDataVizGeometries');
    buildDataVizGeometries(geoPaths);
    console.timeEnd('buildDataVizGeometries');

    visualizationMesh = new THREE.Object3D();
    rotating.add(visualizationMesh);

    selectVisualization(geoPaths);


    //  -----------------------------------------------------------------------------
    //  Setup our renderer
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;

    renderer.sortObjects = false;
    renderer.generateMipmaps = false;

    glContainer.appendChild( renderer.domElement );


    //  -----------------------------------------------------------------------------
    //  Event listeners
    document.addEventListener( 'mousemove', onDocumentMouseMove, true );
    document.addEventListener( 'windowResize', onDocumentResize, false );

    //masterContainer.addEventListener( 'mousedown', onDocumentMouseDown, true );
    //masterContainer.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, true );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

    masterContainer.addEventListener( 'click', onClick, true );
    masterContainer.addEventListener( 'mousewheel', onMouseWheel, false );

    //  firefox
    masterContainer.addEventListener( 'DOMMouseScroll', function(e){
            var evt=window.event || e; //equalize event object
            onMouseWheel(evt);
    }, false );

    document.addEventListener( 'keydown', onKeyDown, false);

    //  -----------------------------------------------------------------------------
    //  Setup our camera
    camera = new THREE.PerspectiveCamera( 12, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.z = 1400;
    camera.position.y = 0;
    camera.position.x = 0;

    var windowResize = THREEx.WindowResize(renderer, camera)
}


function animate() {
    if( rotateTargetX !== undefined && rotateTargetY !== undefined ){
        rotateVX += (rotateTargetX - rotateX) * 0.012;
        rotateVY += (rotateTargetY - rotateY) * 0.012;

        if( Math.abs(rotateTargetX - rotateX) < 0.1 && Math.abs(rotateTargetY - rotateY) < 0.1 ){
            rotateTargetX = undefined;
            rotateTargetY = undefined;
        }
    }

    rotateX += rotateVX;
    rotateY += rotateVY;

    rotateVX *= 0.98;
    rotateVY *= 0.98;

    if(dragging || rotateTargetX !== undefined ){
        rotateVX *= 0.6;
        rotateVY *= 0.6;
    }

    rotateY += controllers.spin * 0.01;

    //  constrain the pivot up/down to the poles
    //  force a bit of bounce back action when hitting the poles
    if(rotateX < -rotateXMax){
        rotateX = -rotateXMax;
        rotateVX *= -0.95;
    }
    if(rotateX > rotateXMax){
        rotateX = rotateXMax;
        rotateVX *= -0.95;
    }

    TWEEN.update();

    rotating.rotation.x = rotateX;
    rotating.rotation.y = rotateY;

    renderer.clear();
    renderer.render( scene, camera );

    requestAnimationFrame( animate );

    rotating.traverse(function(mesh) {
        if (mesh.update !== undefined) {
            mesh.update();
        }
    });

    for( var i in markers ){
        var marker = markers[i];
        marker.update();
    }
}

