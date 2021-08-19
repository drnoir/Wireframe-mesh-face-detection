"use strict";


// SETTINGS of this demo:
const SETTINGS = {
  maxFaces: 4, // max number of detected faces
};

// some globalz:
let THREECAMERA = null;

// callback: launched if a face is detected or lost
function detect_callback(faceIndex, isDetected){
  if (isDetected){
    console.log('INFO in detect_callback(): face n°', faceIndex, 'DETECTED');
  } else {
    console.log('INFO in detect_callback(): face n°', faceIndex, 'LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec){
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
  threeStuffs.faceObjects.forEach(function(faceObject){ // display the mesh for each detected face
    new THREE.BufferGeometryLoader().load('face/maskMesh.json', function(maskGeometry){
      maskGeometry.computeVertexNormals();
      var maskMaterial=new THREE.MeshNormalMaterial();
      var maskMesh=new THREE.Mesh(maskGeometry, maskMaterial);
      const wireframe = new THREE.WireframeGeometry( maskGeometry );

      const line = new THREE.LineSegments( wireframe );
      line.material.depthTest = false;
      line.material.opacity = 1;
      line.material.transparent = true;
      faceObject.add(line );
    });
  });

  // CREATE THE CAMERA:
  THREECAMERA = JeelizThreeHelper.create_camera();
}

// Entry point, launched by body.onload():
function main(){
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '/neuralNets/', // root of NN_DEFAULT.json file
    maxFacesDetected: SETTINGS.maxFaces,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop)
    callbackTrack: function(detectState){
      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); //end JEELIZFACEFILTER.init call
}