/*
Created by: Matthew Chiarelli, ID: 150798950
Created for: CP-411 on December 1st 2019
*/

var pointLight, sun, moon, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit, ring, controls, scene, camera, renderer, scene;
var planetSegments = 48;

var raycaster = new THREE.Raycaster(), mouse = new THREE.Vector2();//For getting what user has selected by mouse
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener('keydown', onKeyDown, false);


var planetInfoText = document.createElement('div');
var cntrlInfo = document.createElement('div');

var mercuryInfo = "Distance from Sun: 58,000,000 km <br /> Size (Diameter): 4,879 km <br /> Year (Earth Days): 87.969";
var venusInfo = "Distance from Sun: 108,000,000 km <br /> Size (Diameter): 12,334 km <br /> Year (Earth Days): 224.7";
var earthInfo = "Distance from Sun: 150,000,000 km <br /> Size (Diameter): 13,000 km <br /> Year (Earth Days): 365.2564";
var moonInfo = "Distance from Earth: 384,000 km <br /> Size (Diameter): 3,474 km <br /> Cycle (Earth Days): 29.5";
var marsInfo = "Distance from Sun: 228,000,000 km <br /> Size (Diameter): 6,800 km <br /> Year (Earth Days): 687";
var jupiterInfo = "Distance from Sun: 779,000,000 km <br /> Size (Diameter): 143,000 km <br /> Year (Earth Days): 4332.59836";
var saturnInfo = "Distance from Sun: 1,430,000,000 km <br /> Size (Diameter): 74,900 km <br /> Year (Earth Days): 10,755.7";
var uranusInfo = "Distance from Sun: 2,880,000,000 km <br /> Size (Diameter): 51,118 km <br /> Year (Earth Days): 31,000";
var neptuneInfo = "Distance from Sun: 4,500,000,000 km <br /> Size (Diameter): 49,528 km <br /> Year (Earth Days): 60,200";

var mercuryData = createPlanet(87.969, 0.015, 5.7, "mercury", "https://i.imgur.com/m5UYF2G.jpg", 0.11, planetSegments, false);
var venusData = createPlanet(224.7, 0.015, 10.8, "venus", "https://i.imgur.com/txVVES6.jpg", 0.9, planetSegments,  false);
var earthData = createPlanet(365.2564, 0.015, 15, "earth", "https://i.imgur.com/m5UYF2G.jpg", 1, planetSegments,  true);
var moonData = createPlanet(29.5, 0.01, 2.8, "moon", "https://i.imgur.com/ncOZrgz.jpg", 0.5, planetSegments, false);
var marsData = createPlanet(687, 0.015, 22.8, "mars", "https://i.imgur.com/j6T4pv5.jpg", 0.53, planetSegments,  false);
var jupiterData = createPlanet(4332.59836, 0.015, 77.9, "jupiter", "https://i.imgur.com/OnwpMbg.jpg", 11.2, planetSegments,  false);
var saturnData = createPlanet(10755.7, 0.01, 143, "saturn", "https://i.imgur.com/Ab4HplD.jpg", 9.45, planetSegments, false);
var uranusData = createPlanet(31000, 0.015, 288, "uranus", "https://i.imgur.com/6MP0DcZ.jpg", 4, planetSegments,  false);
var neptuneData = createPlanet(60200, 0.015, 450, "neptune", "https://i.imgur.com/g3pyLXN.jpg", 3.88, planetSegments,  false);

var orbitData = {physicsMultiplier: 20, rotate: true, orbitSun: true};
var clock = new THREE.Clock();

var fLoader = new THREE.FontLoader();

/**
 * 
 * @param {type} orbit decimal
 * @param {type} rotation decimal
 * @param {type} distance decimal, distance of 1 = 10 million km
 * @param {type} nameOfPlanet string
 * @param {type} tex image file path
 * @param {type} planetSize decimal
 * @param {type} seg integer
 * @param {type} select bool
 * @returns {createPlanet.mainAnonym$0}
 */
function createPlanet(orbit, rotation, distance, nameOfPlanet, tex, planetSize, seg, select) {
    return {
        orbitRate: orbit

        , rotationRate: rotation
        , distanceFromAxis: distance * 2
        , name: nameOfPlanet
        , texture: tex
        , size: planetSize * 0.8
        , segments: seg
        , selected: select
    };
}

/**
 * create a visible ring and add it to the scene.
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} colour HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function createRing(size, innerDiameter, facets, colour, name, distanceFromAxis) {
    var ring1Geometry = new THREE.RingGeometry(size, innerDiameter, facets);
    var ring1Material = new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide});
    var myRing = new THREE.Mesh(ring1Geometry, ring1Material);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

/**
 * Generates a 3 dimensional ring to be used as saturns
 * @param {type} size decimal
 * @param {type} innerDiameter decimal
 * @param {type} facets integer
 * @param {type} myColor HTML color
 * @param {type} name string
 * @param {type} distanceFromAxis decimal
 * @returns {THREE.Mesh|myRing}
 */
function createRing3D(size, innerDiameter, facets, myColor, name, distanceFromAxis) {
    var ringGeometry = new THREE.TorusGeometry(size, innerDiameter, facets, facets);
    var ringMaterial = new THREE.MeshBasicMaterial({color: myColor, side: THREE.DoubleSide});
    myRing = new THREE.Mesh(ringGeometry, ringMaterial);
    myRing.name = name;
    myRing.position.set(distanceFromAxis, 0, 0);
    myRing.rotation.x = Math.PI / 2;
    scene.add(myRing);
    return myRing;
}

/**
 * Simplifies the creation of materials used for visible objects.
 * @param {type} type
 * @param {type} color
 * @param {type} tex
 * @returns {THREE.MeshStandardMaterial|THREE.MeshLambertMaterial|THREE.MeshPhongMaterial|THREE.MeshBasicMaterial}
 */
function getMaterial(type, color, tex) {
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
        map: tex === undefined ? null : tex
    };

    switch (type) {
        case 'basic':
            return new THREE.MeshBasicMaterial(materialOptions);
        case 'lambert':
            return new THREE.MeshLambertMaterial(materialOptions);
        case 'phong':
            return new THREE.MeshPhongMaterial(materialOptions);
        case 'standard':
            return new THREE.MeshStandardMaterial(materialOptions);
        default:
            return new THREE.MeshBasicMaterial(materialOptions);
    }
}

/**
 *  Draws all of the orbits to be shown in the scene.
 * @returns {undefined}
 */
function createVisibleOrbits() {
    var orbitWidth = 0.03;

    mercuryOrbit = createRing(mercuryData.distanceFromAxis + orbitWidth
        , mercuryData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "mercuryOrbit"
        , 0);

    venusOrbit = createRing(venusData.distanceFromAxis + orbitWidth
         , venusData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "venusOrbit"
        , 0);

    earthOrbit = createRing(earthData.distanceFromAxis + orbitWidth
        , earthData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "earthOrbit"
        , 0);

     marsOrbit = createRing(marsData.distanceFromAxis + orbitWidth
        , marsData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "marsOrbit"
        , 0);

    jupiterOrbit = createRing(jupiterData.distanceFromAxis + orbitWidth
        , jupiterData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "jupiterOrbit"
        , 0);

    saturnOrbit = createRing(saturnData.distanceFromAxis + orbitWidth
        , saturnData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "saturnOrbit"
        , 0);
       
    uranusOrbit = createRing(uranusData.distanceFromAxis + orbitWidth
        , uranusData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "uranusOrbit"
        , 0);

    neptuneOrbit = createRing(neptuneData.distanceFromAxis + orbitWidth
        , neptuneData.distanceFromAxis - orbitWidth
        , 320
        , 0xffffff
        , "neptuneOrbit"
         , 0);
}

/**
 * Simplifies the creation of a sphere.
 * @param {type} material THREE.SOME_TYPE_OF_CONSTRUCTED_MATERIAL
 * @param {type} size decimal
 * @param {type} segments integer
 * @returns {getSphere.obj|THREE.Mesh}
 */
function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);


    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;

    return obj;
}

/**
 * Generates a planet, subsequently adding it to the overall scene
 * @param {type} data data for a planet object
 * @param {type} x integer
 * @param {type} y integer
 * @param {type} z integer
 * @param {type} mat string that is passed to getMaterial()
 * @returns {getSphere.obj|THREE.Mesh|addPlanet.myPlanet}
 */
function addPlanet(data, x, y, z, mat) {
    var myMaterial;
    var passThisTexture;

    if (data.texture && data.texture !== "") {
        const loader = new THREE.TextureLoader();
        passThisTexture = loader.load(data.texture);

    }
    if (mat) {
        myMaterial = getMaterial(mat, "rgb(255, 255, 255 )", passThisTexture);
    } else {
        myMaterial = getMaterial("lambert", "rgb(255, 255, 255 )", passThisTexture);
    }

    myMaterial.receiveShadow = true;
    myMaterial.castShadow = true;
    var myPlanet = getSphere(myMaterial, data.size, data.segments);
    myPlanet.receiveShadow = true;
    myPlanet.name = data.name;
    scene.add(myPlanet);
    myPlanet.position.set(x, y, z);

    return myPlanet;
}

/**
 * creates and returns a pointlight object of the given strength and colour
 * @param {type} intensity decimal
 * @param {type} colour colour type
 * @returns {THREE.PointLight|getPointLight.light}
 */
function getPointLight(intensity, colour) {
    var light = new THREE.PointLight(colour, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

/**
 * ypdates the planets position along its orbit as well as its current rotation
 * @param {type} planet
 * @param {type} data
 * @param {type} time
 * @param {type} haltRotation optional set to true for rings
 */
function updatePlanet(planet, data, time, haltRotation) {
    if (orbitData.rotate && !haltRotation) {
        planet.rotation.y += data.rotationRate;
    }
    if (orbitData.orbitSun) {
        planet.position.x = Math.cos(time 
                * (1.0 / (data.orbitRate * orbitData.physicsMultiplier)) + 10.0) 
                * data.distanceFromAxis;
        planet.position.z = Math.sin(time 
                * (1.0 / (data.orbitRate * orbitData.physicsMultiplier)) + 10.0) 
                * data.distanceFromAxis;
    }
}

/**
 * Move the moon around its orbit with the planet, and rotate it.
 * @param {type} moon
 * @param {type} planet
 * @param {type} data
 * @param {type} time
 */
function moveMoon(moon, planet, data, time) {
    updatePlanet(moon, data, time);
    if (orbitData.orbitSun) {
        moon.position.x = moon.position.x + planet.position.x;
        moon.position.z = moon.position.z + planet.position.z;
    }
}

/* If the planet is selected, display relevent info about planet
*/
function infoDisplay(){

}

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseDown( event ) {
    raycaster.setFromCamera( mouse.clone(), camera );  
    var intersects = raycaster.intersectObjects( scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {

        if(intersects[0].object.name == "mercury" ||
        intersects[0].object.name == "venus" ||
        intersects[0].object.name == "earth" ||
        intersects[0].object.name == "mars" ||
        intersects[0].object.name == "jupiter" ||
        intersects[0].object.name == "saturn" ||
        intersects[0].object.name == "uranus" ||
        intersects[0].object.name == "neptune" ||
        intersects[0].object.name == "moon"){
            deSelectPlanets();

            intersects[0].object.selected = true;
            

        }
	}
}

/*Makes every planet in scene unselected */
function deSelectPlanets(){
    scene.getObjectByName("mercury").selected = false;
    scene.getObjectByName("venus").selected = false;
    scene.getObjectByName("earth").selected = false;
    scene.getObjectByName("mars").selected = false;
    scene.getObjectByName("jupiter").selected = false;
    scene.getObjectByName("saturn").selected = false;
    scene.getObjectByName("uranus").selected = false;
    scene.getObjectByName("neptune").selected = false;
    scene.getObjectByName("moon").selected = false;
}

function onKeyDown( event ) {
    if (event.keyCode == 77) {//[m]ercury
        deSelectPlanets();
        scene.getObjectByName("mercury").selected = true;
 
    } else if (event.keyCode == 86) {//[v]enus
        deSelectPlanets();
        scene.getObjectByName("venus").selected = true;

    } else if (event.keyCode == 69) {//[e]arth - Giggity
        deSelectPlanets();
        scene.getObjectByName("earth").selected = true;

    } else if (event.keyCode == 65) {//m[a]rs
        deSelectPlanets();
        scene.getObjectByName("mars").selected = true;

    } else if (event.keyCode == 74) {//[j]upiter
        deSelectPlanets();
        scene.getObjectByName("jupiter").selected = true;
    } else if (event.keyCode == 83) {//[s]aturn
        deSelectPlanets();
        scene.getObjectByName("saturn").selected = true;
    }else if (event.keyCode == 85) {//[u]ranus
        deSelectPlanets();
        scene.getObjectByName("uranus").selected = true;
    }else if (event.keyCode == 78) {//[n]eptune
        deSelectPlanets();
        scene.getObjectByName("neptune").selected = true;
    }
}
/**
 * Handles all animations regarding position and rotation as well as texture coloring and lighting
 * @param {type} renderer
 * @param {type} scene
 * @param {type} camera
 * @param {type} controls
 * @returns {undefined}
 */
function update(renderer, scene, camera, controls) {
    pointLight.position.copy(sun.position);

    //Rest colors
    scene.getObjectByName("mercury").material.color.set(0xffffff);
    scene.getObjectByName("venus").material.color.set(0xffffff);
    scene.getObjectByName("earth").material.color.set(0xffffff);
    scene.getObjectByName("mars").material.color.set(0xffffff);
    scene.getObjectByName("jupiter").material.color.set(0xffffff);
    scene.getObjectByName("saturn").material.color.set(0xffffff);
    scene.getObjectByName("uranus").material.color.set(0xffffff);
    scene.getObjectByName("neptune").material.color.set(0xffffff);
    scene.getObjectByName("moon").material.color.set(0xffffff);
    

    raycaster.setFromCamera( mouse.clone(), camera );  
    var intersects = raycaster.intersectObjects( scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {

        if(intersects[0].object.name == "mercury" ||
        intersects[0].object.name == "venus" ||
        intersects[0].object.name == "earth" ||
        intersects[0].object.name == "mars" ||
        intersects[0].object.name == "jupiter" ||
        intersects[0].object.name == "saturn" ||
        intersects[0].object.name == "uranus" ||
        intersects[0].object.name == "neptune" ||
        intersects[0].object.name == "moon"){
		    intersects[0].object.material.color.set(0xff0000);
        }
	}

    //Update camera position and look at location, update info text as well
    if(scene.getObjectByName("mercury").selected == true){
        lookAtPlanet(mercury,camera);
        planetInfoText.innerHTML = mercuryInfo;

    } else if(scene.getObjectByName("venus").selected == true){
        lookAtPlanet(venus,camera);
        planetInfoText.innerHTML = venusInfo;
    }else if(scene.getObjectByName("earth").selected == true){
        lookAtPlanet(earth,camera);
        planetInfoText.innerHTML = earthInfo;
    }else if(scene.getObjectByName("mars").selected == true){
        lookAtPlanet(mars,camera);
        planetInfoText.innerHTML = marsInfo;
    }else if(scene.getObjectByName("jupiter").selected == true){
        lookAtPlanet(jupiter,camera);
        planetInfoText.innerHTML = jupiterInfo;
    }else if(scene.getObjectByName("saturn").selected == true){
        lookAtPlanet(saturn,camera);
        planetInfoText.innerHTML = saturnInfo;
    }else if(scene.getObjectByName("uranus").selected == true){
        lookAtPlanet(uranus,camera);
        planetInfoText.innerHTML = uranusInfo;
    }else if(scene.getObjectByName("neptune").selected == true){
        lookAtPlanet(neptune,camera);
        planetInfoText.innerHTML = neptuneInfo;
    }else if(scene.getObjectByName("moon").selected == true){
        lookAtPlanet(moon,camera);
        planetInfoText.innerHTML = moonInfo;
    }
   
    //Update relevent text info
    infoDisplay();

    controls.update();

    var time = Date.now();

    //Mercury
    updatePlanet(mercury, mercuryData, time);

    //Venus
    updatePlanet(venus, venusData, time);

    //Earth
    updatePlanet(earth, earthData, time);
    updatePlanet(ring, earthData, time, true);
    moveMoon(moon, earth, moonData, time);


    //Mars
    updatePlanet(mars, marsData, time);

    //Jupiter
    updatePlanet(jupiter, jupiterData, time);


    //Saturn
    updatePlanet(saturn, saturnData, time);


    //Uranus
    updatePlanet(uranus, uranusData, time);


    //Neptune
    updatePlanet(neptune, neptuneData, time);

    renderer.render(scene, camera);

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}


function lookAtPlanet(planet, camera){
    
    
    if(controls.target.x > planet.getWorldPosition().x){
        controls.target.x += (planet.getWorldPosition().x - controls.target.x) * 0.1;
    }

    

    if(controls.target.x < planet.getWorldPosition().x){
        controls.target.x += (planet.getWorldPosition().x - controls.target.x) * 0.1;
    }
    
    if(controls.target.y > planet.getWorldPosition().y){
        controls.target.y += (planet.getWorldPosition().y - controls.target.y) * 0.1;
    }

    

    if(controls.target.y < planet.getWorldPosition().y){
        controls.target.y +=(planet.getWorldPosition().y - controls.target.y) * 0.1;
    }
    
    if(controls.target.z > planet.getWorldPosition().z){
        controls.target.z += (planet.getWorldPosition().z - controls.target.z) * 0.1;
    }

    

    if(controls.target.z < planet.getWorldPosition().z){
        controls.target.z += (planet.getWorldPosition().z - controls.target.z) * 0.1;
    }

}
/**
 * Loads the initial scene, camera and positions of worlds
 */
function init() {
    //initialize camera properties
    camera = new THREE.PerspectiveCamera(
            75, //FOV
            window.innerWidth / window.innerHeight, //Aspect ratio
            1, //min clipping
            1200// max clipping
            );

    camera.position.set(-30,30,30);
    camera.up = new THREE.Vector3(0,0,1);


    //This scene will old all visible objects to be loaded
    scene = new THREE.Scene();

    //Generate the renderer to handle all animations, attach it to the HTML div
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('viewer').appendChild(renderer.domElement);

    //These controls allow the user to manipulte the camera with mouse wheel and drag
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    


    //Setup "Sky"Box
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'https://i.imgur.com/K9aRIFR.png',//right
      'https://i.imgur.com/FPL7j6k.png', //left
      'https://i.imgur.com/4rN7LON.png', //top
      'https://i.imgur.com/MYqEXa6.png',//bot
      'https://i.imgur.com/UqPSGvj.png',//front
      'https://i.imgur.com/YHqDJ6B.png',//back
    ]);
    scene.background = texture;


    //SET UP LIGHTING-----------------------
    //ambiant light to apply to all objects in scene
    var ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    //Sun Light will be a point light
    pointLight = getPointLight(1.0, "rgb(255, 220, 180)");
    scene.add(pointLight);
    //----------------------------



    // Create the sun.
    var sunMaterial = getMaterial("basic", "rgb(255, 255, 255)");
    sun = getSphere(sunMaterial, 8, 48);
    scene.add(sun);
/*
    // Create the glow of the sun.
    THREE.ImageUtils.crossOrigin = '';
    var mapOverlay = THREE.ImageUtils.loadTexture('https://i.imgur.com/UXW3q8s.png');
    var spriteMaterial = new THREE.SpriteMaterial(
            {
                map:  mapOverlay
                , useScreenCoordinates: false
                , color: 0xffffee
                , transparent: false
                , blending: THREE.AdditiveBlending
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(70, 70, 1.0);
    sun.add(sprite); // This centers the glow at the sun.
*/
    // Create the Earth, the Moon, and a ring around the earth.
    mercury = addPlanet(mercuryData, mercuryData.distanceFromAxis, 0, 0);
    venus = addPlanet(venusData, venusData.distanceFromAxis, 0, 0);
    earth = addPlanet(earthData, earthData.distanceFromAxis, 0, 0);
    mars = addPlanet(marsData, marsData.distanceFromAxis, 0, 0);
    jupiter = addPlanet(jupiterData, jupiterData.distanceFromAxis, 0, 0);
    saturn = addPlanet(saturnData, saturnData.distanceFromAxis, 0, 0);
    uranus = addPlanet(uranusData, uranusData.distanceFromAxis, 0, 0);
    neptune = addPlanet(neptuneData, neptuneData.distanceFromAxis, 0, 0);

    moon = addPlanet(moonData, moonData.distanceFromAxis, 0, 0);
    ring = createRing3D(1.8, 0.05, 480, 0x757064, "ring", earthData.distanceFromAxis);

    //Generate orbit circles for each planet
    createVisibleOrbits();

    // Create the GUI that displays controls.
    var cntrlPanel = new dat.GUI();

    var speed = cntrlPanel.addFolder('Planet Physics');
    speed.add(orbitData, 'physicsMultiplier', 1, 20);
    speed.add(orbitData, 'orbitSun', 0, 1);
    speed.add(orbitData, 'rotate', 0, 1);
    var light = cntrlPanel.addFolder('Sun Light');
    light.add(pointLight, 'intensity', 0, 10);

 



    planetInfoText.style.width = 100;
    planetInfoText.style.height = 100;
    planetInfoText.style.top = 10 + 'px';
    planetInfoText.style.left = 10 + 'px';
    planetInfoText.style.position = 'absolute';
    planetInfoText.style.backgroundColor = "white";
    planetInfoText.innerHTML = "";

    document.body.appendChild(planetInfoText);

    cntrlInfo.style.width = 100;
    cntrlInfo.style.height = 100;
    cntrlInfo.style.top = 500 + 'px';
    cntrlInfo.style.left = 10 + 'px';
    cntrlInfo.style.position = 'absolute';
    cntrlInfo.style.backgroundColor = "white";
    cntrlInfo.innerHTML = "Planet Keys:<br /> [m]ercury <br /> [v]enus <br /> [e]arth <br /> m[a]rs <br /> [j]upiter <br /> [s]aturn <br /> [u]ranus <br /> [n]eptune";

    document.body.appendChild(cntrlInfo);

    //Constantly update planet data
    update(renderer, scene, camera, controls);
}

// Start everything.
init();
