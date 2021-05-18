let menuPosition;

//navgiacia v menu
goHome = function () {
    window.location.hash = '#home';
}

goMenu = function () {
    displayMenu();
}

//zobrazenie hlavneho menu
function displayMenu() {
    window.location.hash = "menu";
    let worldPos = getCameraWorldPosition();
    let cameraRotation = getCameraWorldRotation();
    menuPosition = worldPos;
    setTimeout(function () {
        document.getElementById('menuForm').setAttribute('position', `${menuPosition.x} ${1.5} ${menuPosition.z}`);
        document.getElementById('menuForm').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
    }, 50);
}

//ziskanie svetovej pozicie kamery
function getCameraWorldPosition() {
    let camera = document.getElementById('cameraPosition');
    let worldPos = new THREE.Vector3();
    return worldPos.setFromMatrixPosition(camera.object3D.matrixWorld);
}

//ziskanie svetovej rotacie kamery
function getCameraWorldRotation() {
    return document.getElementById('cameraWrapper').getAttribute('rotation');
}
