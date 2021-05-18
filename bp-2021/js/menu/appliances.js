//tlacidlo ZARIADENIA z menu + ziskanie zariadeni zo servera
function toDevices() {
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
            generateAppliances(responseJSON);
        })
        .catch(error => console.log('error', error));
}

//generovanie HTML pre vsetky zariadenia
let appSize;
let start;

function generateAppliances(appliances) {
    window.location.hash = "devices";
    appSize = appliances.length;
    setTimeout(function () {
        let worldPos;
        if (menuPosition) worldPos = menuPosition;
        else worldPos = getCameraWorldPosition();
        let cameraRotation = getCameraWorldRotation();
        let appliancesForm = document.getElementById('appliancesForm');

        appliancesForm.innerHTML = '';
        let title = document.createElement('a-troika-text');
        title.setAttribute('value', 'Zariadenia');

        title.setAttribute('color', '#0E53A7');
        title.setAttribute('align', 'center');
        title.setAttribute('position', '0 0.3 0');
        title.setAttribute('font', "assets/fonts/font.ttf");

        let icon = document.createElement('a-gui-icon-button');
        icon.setAttribute('height', "0.15");
        icon.setAttribute('onclick', 'goMenu()');
        icon.setAttribute('background-color', '#0E53A7');
        icon.setAttribute('hover-color', 'white');
        icon.setAttribute('position', '-0.8 -0.015 0');
        icon.setAttribute('icon-font-size', '105px');
        icon.setAttribute('class', 'clickable');
        icon.setAttribute('icon', "android-arrow-back");

        let iconX = document.createElement('a-gui-icon-button');
        iconX.setAttribute('height', "0.15");
        iconX.setAttribute('onclick', 'goHome()');
        iconX.setAttribute('background-color', '#0E53A7');
        iconX.setAttribute('hover-color', 'white');
        iconX.setAttribute('position', '0.8 -0.015 0');
        iconX.setAttribute('icon-font-size', '105px');
        iconX.setAttribute('class', 'clickable');
        iconX.setAttribute('icon', "close-round");

        let iconAdd = document.createElement('a-gui-icon-button');
        iconAdd.setAttribute('height', "0.28");
        iconAdd.setAttribute('onclick', 'toAddDevice()');
        iconAdd.setAttribute('background-color', '#0E53A7');
        iconAdd.setAttribute('hover-color', 'white');
        iconAdd.setAttribute('position', '0 -1.85 0');
        iconAdd.setAttribute('icon-font-size', '170px');
        iconAdd.setAttribute('class', 'clickable');
        iconAdd.setAttribute('icon', "android-add");

        title.appendChild(iconX);
        title.appendChild(icon);
        title.appendChild(iconAdd);
        appliancesForm.appendChild(title);

        for (let i = 0; i < appliances.length; i++) {
            let appliance = appliances[i];
            let el = document.createElement('a-gui-label');
            el.setAttribute('value', i + 1 + ". " + appliance.name);
            el.setAttribute('height', '0.25');
            el.setAttribute('width', '1.85');
            el.setAttribute('align', 'left');
            el.setAttribute('font-size', '60px');
            el.setAttribute('font-weight', '400');
            el.setAttribute('margin', "0 0 0.05 0");
            el.setAttribute('background-color', "white");
            el.setAttribute('hover-color', "white");
            el.setAttribute('font-color', "#0E53A7");
            el.id = i.toString();
            let x = -(i % 5);
            el.setAttribute('position', `0 ${x * 0.3} 0`);
            if (i >= 0 && i <= 4)
                el.setAttribute('visible', true)
            else el.setAttribute('visible', false)


            let button1 = document.createElement('a-gui-icon-button');
            button1.setAttribute('height', "0.15")
            button1.setAttribute('icon', "android-settings");
            button1.setAttribute('class', "clickable");
            button1.setAttribute('icon-font-size', "90px");
            button1.setAttribute('background-color', "#0E53A7");
            button1.setAttribute('font-color', "white");
            button1.setAttribute('onclick', "showAppliance('" + appliance.id + "')");
            if (i >= 0 && i <= 4) {
                button1.setAttribute('position', "0.6 0 0")
            } else button1.setAttribute('position', "0.6 0 -1")
            el.appendChild(button1);

            let button2 = document.createElement('a-gui-icon-button');
            button2.setAttribute('height', "0.15")
            button2.setAttribute('class', "clickable");
            button2.setAttribute('icon-font-size', "90px");
            button2.setAttribute('onclick', "deleteApplianceModal('" + appliance.id + "')");
            button2.setAttribute('icon', "android-delete");
            button2.setAttribute('background-color', "#DC143C");
            button2.setAttribute('font-color', "white");
            if (i >= 0 && i <= 4) {
                button2.setAttribute('position', "0.8 0 0")
            } else button2.setAttribute('position', "0.8 0 -1")
            el.appendChild(button2);

            appliancesForm.appendChild(el);
        }

        start = 0;
        let buttonBack = document.createElement('a-gui-icon-button');
        buttonBack.id = 'buttonBack';
        buttonBack.setAttribute('height', "0.2");
        buttonBack.setAttribute('position', "-1.1 -0.6 0");
        buttonBack.setAttribute('icon', "arrow-left-a");
        buttonBack.setAttribute('icon-font-size', "110px");
        buttonBack.setAttribute('onclick', "appliancesFromToBack()");
        buttonBack.setAttribute('background-color', "#0E53A7");
        buttonBack.setAttribute('font-color', "white");
        buttonBack.setAttribute('visible', "false");
        appliancesForm.appendChild(buttonBack);

        let buttonNext = document.createElement('a-gui-icon-button');
        buttonNext.id = 'buttonNext';
        buttonNext.setAttribute('height', "0.2");
        buttonNext.setAttribute('position', "1.1 -0.6 0");
        buttonNext.setAttribute('icon', "arrow-right-a");
        buttonNext.setAttribute('class', "clickable");
        buttonNext.setAttribute('icon-font-size', "110px");
        buttonNext.setAttribute('onclick', "appliancesFromToNext()");
        buttonNext.setAttribute('background-color', "#0E53A7");
        buttonNext.setAttribute('font-color', "white");
        if (appSize > start + 5) buttonNext.setAttribute('visible', "true");
        else buttonNext.setAttribute('visible', "false");
        appliancesForm.appendChild(buttonNext);

        appliancesForm.setAttribute('position', `${worldPos.x} ${2.1} ${worldPos.z}`);
        appliancesForm.setAttribute('rotation', `0 ${cameraRotation.y} 0`);

    }, 150);
}

//tlacidlo spat v zoznamie zariadeni
function appliancesFromToBack() {
    start = start - 5;
    refreshAppliances();
}

//tlacidlo dalej v zoznamie zariadeni
function appliancesFromToNext() {
    start = start + 5;
    refreshAppliances();
}

//uprava viditelnych zariadeni a tlacidiel na posun
function refreshAppliances() {
    for (let i = 0; i < appSize; i++) {
        let current = document.getElementById(i.toString());
        let children = Array.from(current.childNodes);
        if (i >= start && i <= start + 4) {
            current.setAttribute('visible', true);
            for (let i = 0; i < children.length; i++) {
                let pos = children[i].getAttribute('position');
                if (children[i].tagName !== 'A-ENTITY')
                    children[i].setAttribute('position', {x: pos.x, y: pos.y, z: 0});
            }
        } else {
            current.setAttribute('visible', false);
            for (let i = 0; i < children.length; i++) {
                let pos = children[i].getAttribute('position');
                if (children[i].tagName !== 'A-ENTITY')
                    children[i].setAttribute('position', {x: pos.x, y: pos.y, z: -1});
            }
        }
    }
    let back = document.getElementById('buttonBack');
    if (start > 0) {
        back.setAttribute('class', "clickable");
        back.setAttribute('visible', "true");
    }
    else {
        back.setAttribute('visible', "false");
        back.setAttribute('class', "");
    }

    let next = document.getElementById('buttonNext');
    if (appSize > start + 5) {
        next.setAttribute('class', "clickable");
        next.setAttribute('visible', "true");
    }
    else {
        next.setAttribute('visible', "false");
        next.setAttribute('class', "");
    }
}

//zobrazenie formulara vybrateho zariadenia
function showAppliance(id) {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/appliance/${id}`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            let children = Array.from(document.getElementById('appliancesForm').childNodes);
            for (let i = 0; i < children.length; i++) {
                let pos = children[i].getAttribute('position');
                if (pos.z == '0.7')
                    children[i].remove();
            }
            jsonToForm(responseJSON, true);
            document.getElementById('currentForm').id = responseJSON.name + "Form";
        })
        .catch(error => console.log('error', error));
}

//MODAL pre potvrdenie zmazania vybrateho zariadenia
function deleteApplianceModal(id) {
    modalMessage('Odstrániť zariadenie?', "deleteAppliance('" + id + "')", 'appliancesForm');
}

//zmazanie vybrateho zariadenia
function deleteAppliance(id) {
    document.getElementById('modalOdstrániť zariadenie?').remove();

    // delete MEMBER from HOME
    let deleteh = new Headers();
    deleteh.append("Authorization", `Bearer ${tokens.accessToken}`);
    deleteh.append("Content-Type", "application/json");


    let raw = JSON.stringify({
        "entityId": id,
        "homeId": currentHome
    });

    let requestOptions = {
        method: 'DELETE',
        headers: deleteh,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/home/appliance/remove", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'appliancesForm');
            } else toDevices();
        })
        .catch(error => {
            console.log('error', error);

        });
}

//////////////////////////////////////////////////////////////////
/////////////////SEKCIA PRIDANIE ZARIADENIA///////////////////////
//////////////////////////////////////////////////////////////////
function toAddDevice() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/appliance/mine/not-assigned`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            generateAddAppliance(responseJSON);
        })
        .catch(error => console.log('error', error));
}

//generovanie HTML pre vsetky moje zariadenia bez domacnosti
let appSizeAdd;
let startAdd;

function generateAddAppliance(appliances) {
    window.location.hash = "addDevice";
    appSizeAdd = appliances.length;
    setTimeout(function () {
        let worldPos;
        if (menuPosition) worldPos = menuPosition;
        else worldPos = getCameraWorldPosition();
        let cameraRotation = getCameraWorldRotation();
        let appliancesForm = document.getElementById('addApplianceForm');

        appliancesForm.innerHTML = '';
        let title = document.createElement('a-troika-text');
        title.setAttribute('value', 'Pridaj zariadenie');
        title.setAttribute('width', '4');
        title.setAttribute('font-size', '0.15');
        title.setAttribute('color', '#0E53A7');
        title.setAttribute('align', 'center');
        title.setAttribute('position', '0 0.3 0');
        title.setAttribute('font', "assets/fonts/font.ttf");

        let icon = document.createElement('a-gui-icon-button');
        icon.setAttribute('height', "0.15");
        icon.setAttribute('onclick', 'toDevices()');
        icon.setAttribute('background-color', '#0E53A7');
        icon.setAttribute('hover-color', 'white');
        icon.setAttribute('position', '-0.8 -0.015 0');
        icon.setAttribute('icon-font-size', '105px');
        icon.setAttribute('class', 'clickable');
        icon.setAttribute('icon', "android-arrow-back");

        let iconX = document.createElement('a-gui-icon-button');
        iconX.setAttribute('height', "0.15");
        iconX.setAttribute('onclick', 'goHome()');
        iconX.setAttribute('background-color', '#0E53A7');
        iconX.setAttribute('hover-color', 'white');
        iconX.setAttribute('position', '0.8 -0.015 0');
        iconX.setAttribute('icon-font-size', '105px');
        iconX.setAttribute('class', 'clickable');
        iconX.setAttribute('icon', "close-round");

        title.appendChild(iconX);
        title.appendChild(icon);
        appliancesForm.appendChild(title);

        for (let i = 0; i < appliances.length; i++) {
            let appliance = appliances[i];
            let el = document.createElement('a-gui-label');
            el.setAttribute('value', i + 1 + ". " + appliance.name);
            el.setAttribute('height', '0.25');
            el.setAttribute('width', '1.85');
            el.setAttribute('align', 'left');
            el.setAttribute('font-size', '60px');
            el.setAttribute('font-weight', '400');
            el.setAttribute('margin', "0 0 0.05 0");
            el.setAttribute('background-color', "white");
            el.setAttribute('hover-color', "white");
            el.setAttribute('font-color', "#0E53A7");
            el.id = i.toString();
            let x = -(i % 5);
            el.setAttribute('position', `0 ${x * 0.3} 0`);
            if (i >= 0 && i <= 4)
                el.setAttribute('visible', true)
            else el.setAttribute('visible', false)

            let button1 = document.createElement('a-gui-icon-button');
            button1.setAttribute('height', "0.15")
            button1.setAttribute('class', "clickable");
            button1.setAttribute('icon-font-size', "90px");
            button1.setAttribute('onclick', "deleteAddApplianceModal('" + appliance.id + "')");
            button1.setAttribute('icon', "android-delete");
            button1.setAttribute('background-color', "#DC143C");
            button1.setAttribute('font-color', "white");
            if (i >= 0 && i <= 4) {
                button1.setAttribute('position', "0.8 0 0")
            } else button1.setAttribute('position', "0.8 0 -1")
            el.appendChild(button1);

            let button2 = document.createElement('a-gui-icon-button');
            button2.setAttribute('height', "0.15")
            button2.setAttribute('icon', "android-add");
            button2.setAttribute('class', "clickable");
            button2.setAttribute('icon-font-size', "90px");
            button2.setAttribute('onclick', "addApplianceModal('" + appliance.id + "')");
            button2.setAttribute('background-color', "#0E53A7");
            button2.setAttribute('font-color', "white");
            if (i >= 0 && i <= 4) {
                button2.setAttribute('position', "0.6 0 0")
            } else button2.setAttribute('position', "0.6 0 -1")
            el.appendChild(button2);

            appliancesForm.appendChild(el);
        }

        startAdd = 0;
        let buttonBack = document.createElement('a-gui-icon-button');
        buttonBack.id = 'buttonBack';
        buttonBack.setAttribute('height', "0.2");
        buttonBack.setAttribute('position', "-1.1 -0.6 0");
        buttonBack.setAttribute('icon', "arrow-left-a");

        buttonBack.setAttribute('icon-font-size', "110px");
        buttonBack.setAttribute('onclick', "appliancesAddFromToBack()");
        buttonBack.setAttribute('background-color', "#0E53A7");
        buttonBack.setAttribute('font-color', "white");
        buttonBack.setAttribute('visible', "false");
        appliancesForm.appendChild(buttonBack);

        let buttonNext = document.createElement('a-gui-icon-button');
        buttonNext.id = 'buttonNext';
        buttonNext.setAttribute('height', "0.2");
        buttonNext.setAttribute('position', "1.1 -0.6 0");
        buttonNext.setAttribute('icon', "arrow-right-a");
        buttonNext.setAttribute('class', "clickable");
        buttonNext.setAttribute('icon-font-size', "110px");
        buttonNext.setAttribute('onclick', "appliancesAddFromToNext()");
        buttonNext.setAttribute('background-color', "#0E53A7");
        buttonNext.setAttribute('font-color', "white");
        if (appSizeAdd > startAdd + 5) buttonNext.setAttribute('visible', "true");
        else buttonNext.setAttribute('visible', "false");
        appliancesForm.appendChild(buttonNext);

        appliancesForm.setAttribute('position', `${worldPos.x} ${2.1} ${worldPos.z}`);
        appliancesForm.setAttribute('rotation', `0 ${cameraRotation.y} 0`);

    }, 150);
}

//tlacidlo spat v zoznamie zariadeni na priradenie
function appliancesAddFromToBack() {
    startAdd = startAdd - 5;
    refreshAddAppliances();
}

//tlacidlo dalej v zoznamie zariadeni na priradenie
function appliancesAddFromToNext() {
    startAdd = startAdd + 5;
    refreshAddAppliances();
}

//uprava viditelnych zariadeni na priradenie a tlacidiel na posun
function refreshAddAppliances() {
    for (let i = 0; i < appSizeAdd; i++) {
        let current = document.getElementById(i.toString());
        let children = Array.from(current.childNodes);
        if (i >= startAdd && i <= startAdd + 4) {
            current.setAttribute('visible', true);
            for (let i = 0; i < children.length; i++) {
                let pos = children[i].getAttribute('position');
                if (children[i].tagName !== 'A-ENTITY')
                    children[i].setAttribute('position', {x: pos.x, y: pos.y, z: 0});
            }
        } else {
            current.setAttribute('visible', false);
            for (let i = 0; i < children.length; i++) {
                let pos = children[i].getAttribute('position');
                if (children[i].tagName !== 'A-ENTITY')
                    children[i].setAttribute('position', {x: pos.x, y: pos.y, z: -1});
            }
        }
    }
    let back = document.getElementById('buttonBack');
    if (startAdd > 0) {
        back.setAttribute('class', "clickable");
        back.setAttribute('visible', "true");
    }
    else {
        back.setAttribute('visible', "false");
        back.setAttribute('class', "");
    }

    let next = document.getElementById('buttonNext');
    if (appSizeAdd > startAdd + 5) {
        next.setAttribute('class', "clickable");
        next.setAttribute('visible', "true");
    }
    else {
        next.setAttribute('visible', "false");
        next.setAttribute('class', "");
    }
}



function addApplianceModal(id) {
    modalMessage('Pridať zariadenie?', "addAppliance('" + id + "')", 'addApplianceForm');
}

function addAppliance(id) {
    document.getElementById('modalPridať zariadenie?').remove();


    let headers2 = new Headers();
    headers2.append("Authorization", `Bearer ${tokens.accessToken}`);
    headers2.append("Content-Type", "application/json");


    let raw = JSON.stringify({
        "entityId": id,
        "homeId": currentHome
    });

    let requestOptions = {
        method: 'PUT',
        headers: headers2,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/home/appliance/add", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'appliancesForm');
            } else toDevices();
        })
        .catch(error => {
            console.log('error', error);
        });
}

function deleteAddApplianceModal(id) {
    modalMessage('Odstrániť zariadenie?', "deleteAddAppliance('" + id + "')", 'addApplianceForm');
}

//zmazanie vybrateho zariadenia
function deleteAddAppliance(id) {
    document.getElementById('modalOdstrániť zariadenie?').remove();

    // delete MEMBER from HOME
    let deleteh = new Headers();
    deleteh.append("Authorization", `Bearer ${tokens.accessToken}`);
    deleteh.append("Content-Type", "application/json");


    let raw = JSON.stringify({
        "entityId": id,
        "homeId": currentHome
    });

    let requestOptions = {
        method: 'DELETE',
        headers: deleteh,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/home/appliance/" + id, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'addApplianceForm');
            } else toAddDevice();
        })
        .catch(error => {
            console.log('error', error);

        });
}


