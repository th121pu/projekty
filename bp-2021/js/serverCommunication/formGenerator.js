//po uspesnom prihlaseni
function generateHomeForms() {
    getData();
    //getDataUpdate();
    document.getElementById("router-view").innerHTML =
        document.getElementById("template-home").innerHTML
    soundEntity = document.querySelector('[sound]');
    getWeatherInfo();
}

let soundEntity;

//ziskanie zariadeni
let createdAppliance;
let currentUser;
let currentHome;
let currentName;

//zistenie sucasneho uzivatela a jeho domacnosti
function getData() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/auth/current-user", getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            currentUser = responseJSON.id;
            currentName = responseJSON.firstname;
        })
        .catch(error => console.log('error', error));


    fetch("https://bp-smart-env-api.herokuapp.com/home/joined", getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            currentHome = responseJSON[0].id;
            getHomeAppliances();
        })
        .catch(error => console.log('error', error));

}

//ziskanie zariadeni z domacnosti
function getHomeAppliances() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/${currentHome}/appliances`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            createdAppliance = responseJSON;
            confirmGettingAppliance();
            generateForms();
        })
        .catch(error => console.log('error', error));
}

//generovanie vsetkych formularov v template-home
function generateForms() {
    for (let i in createdAppliance) {
        let appliance = createdAppliance[i];
        let form = document.getElementById(appliance.name + "Form");
        let elements = createdAppliance[i].control.elements;
        if (form != null) {
            let maxWidth = 0;
            let maxY = 0;
            let maxX = 0;
            for (let j in elements) {
                let current = elements[j];
                let el = document.createElement('a-' + current.elementType);
                el.id = current.elementId + '++' + appliance.id;
                el.value = current.value;
                el.name = current.name;
                el.styleInfo = current.style;
                el.controlName = appliance.control.name;
                el.applianceName = appliance.name;

                let controlElements = elements[j].controlElements;
                let countX = 0;
                let countXpos = 0;
                for (let k in controlElements) {
                    let currentControl = controlElements[k];
                    let elControl = document.createElement('a-' + currentControl.elementType);
                    elControl.id = currentControl.elementId + '++' + el.id;
                    elControl.value = currentControl.value;
                    elControl.name = currentControl.name;
                    elControl.styleInfo = currentControl.style;
                    elControl.controlName = appliance.control.name;
                    elControl.applianceName = appliance.name;
                    if (el.styleInfo.positionY === elControl.styleInfo.positionY) {
                        countX = countX + parseFloat(elControl.styleInfo.sizeX);
                        if (parseFloat(elControl.styleInfo.positionX) > 0)
                            countXpos = countXpos + parseFloat(elControl.styleInfo.sizeX);
                    }
                    form.appendChild(elControl);

                }
                form.appendChild(el);

                let sumX = countX + parseFloat(el.styleInfo.sizeX) + parseFloat(el.styleInfo.positionX);
                if (sumX > maxWidth) {
                    maxWidth = sumX;
                    maxX = (parseFloat(el.styleInfo.sizeX) / 2) + countXpos;
                }

                let sumY = parseFloat(el.styleInfo.sizeY) + parseFloat(el.styleInfo.positionY);
                if (sumY > maxY) {
                    maxY = sumY;
                }
            }
            createFormTitle(appliance.name, maxY, maxX, maxWidth);
        }
    }
}

//vyvorenie panelu pre formular zariadenia - nazov a tlacidlo na zavretie
function createFormTitle(id, maxY, maxX, maxWidth, arMode) {
    let form;
    if (arMode) form = document.getElementById(id + "Form");
    else form = document.getElementById(id + "Form");

    let labelName = document.createElement('a-gui-label');
    let objectWidth = maxWidth - 0.3;
    let posX = maxX - (objectWidth / 2) - 0.3;

    labelName.setAttribute('value', id);
    labelName.setAttribute('width', objectWidth);
    labelName.setAttribute('opacity', '0.5');
    labelName.setAttribute('height', '0.25');
    labelName.setAttribute("font-color", 'white');
    labelName.setAttribute("background-color", '#0E53A7');
    labelName.setAttribute('position', {x: posX, y: maxY, z: 0});
    if (id.length > 15) labelName.setAttribute("font-size", '95px');
    else labelName.setAttribute("font-size", '110px');
    form.appendChild(labelName);

    let closeButton = document.createElement('a-gui-button');
    closeButton.id = 'closeX';
    closeButton.setAttribute('value', "x");
    closeButton.setAttribute('width', '0.25');
    closeButton.setAttribute('height', '0.25');
    closeButton.setAttribute("font-color", 'white');
    closeButton.setAttribute("background-color", '#0E53A7');
    closeButton.setAttribute('position', {x: maxX - 0.125, y: maxY, z: 0});
    let functionName = "closeForm(" + "'" + id + "'" + ")";
    closeButton.setAttribute('onclick', functionName);
    form.appendChild(closeButton);

    setTimeout(function () {
        let children = Array.from(closeButton.childNodes);
        for (let i = 0; i < children.length - 1; i++) {
            children[i].remove();
        }
        let pos = children[children.length - 1].getAttribute('position');
        pos.z = 0.01;
        children[children.length - 1].setAttribute('position', pos);
    }, 4500);
}

//generovanie formulara pre 1 zariadenie - v AR alebo v menu zariadenia
function jsonToForm(appliance, menu) {
    let worldDir = document.getElementById('cameraPosition').object3D.getWorldPosition();
    let form = document.createElement('a-entity');
    if (document.getElementById(appliance.name + "Form"))
        document.getElementById(appliance.name + "Form").remove();
    form.id = appliance.name + "Form";

    if (menu) {
        form.setAttribute('scale', "0.5 0.5 0.5");
        form.setAttribute('position', "0 0 0.7");
        document.getElementById('appliancesForm').appendChild(form);
    } else {
        form.setAttribute('scale', "0.5 0.5 0.5");
        form.setAttribute('position', worldDir);
        form.setAttribute('rotation', getCameraWorldRotation());
        form.setAttribute('follow', 'true');
        let scene = document.querySelector("a-scene");
        scene.appendChild(form);
    }

    let elements = appliance.control.elements;
    if (Array.from(form.childNodes).length === 0) {
        let maxWidth = 0;
        let maxY = 0;
        let maxX = 0;
        for (let j in elements) {
            let current = elements[j];
            let el = document.createElement('a-' + current.elementType);
            el.id = current.elementId + '++' + appliance.id;
            el.value = current.value;
            el.name = current.name;
            el.styleInfo = current.style;
            el.controlName = appliance.control.name;
            el.applianceName = appliance.name;

            let controlElements = elements[j].controlElements;
            let countX = 0;
            let countXpos = 0;
            for (let k in controlElements) {
                let currentControl = controlElements[k];
                let elControl = document.createElement('a-' + currentControl.elementType);
                elControl.id = currentControl.elementId + '++' + el.id;
                elControl.value = currentControl.value;
                elControl.name = currentControl.name;
                elControl.styleInfo = currentControl.style;
                elControl.controlName = appliance.control.name;
                elControl.applianceName = appliance.name;
                if (el.styleInfo.positionY === elControl.styleInfo.positionY) {
                    countX = countX + parseFloat(elControl.styleInfo.sizeX);
                    if (parseFloat(elControl.styleInfo.positionX) > 0)
                        countXpos = countXpos + parseFloat(elControl.styleInfo.sizeX);
                }
                form.appendChild(elControl);
            }
            form.appendChild(el);

            let sumX = countX + parseFloat(el.styleInfo.sizeX) + parseFloat(el.styleInfo.positionX);
            if (sumX > maxWidth) {
                maxWidth = sumX;
                maxX = (parseFloat(el.styleInfo.sizeX) / 2) + countXpos;
            }

            let sumY = parseFloat(el.styleInfo.sizeY) + parseFloat(el.styleInfo.positionY);
            if (sumY > maxY) {
                maxY = sumY;
            }
        }
        createFormTitle(appliance.name, maxY, maxX, maxWidth, true);

    }
    setTimeout(function () {
        let children = Array.from(form.childNodes);
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add('clickable');
        }
    }, 500);
}
