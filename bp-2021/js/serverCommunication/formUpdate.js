//stlacenie tlacidla vo formulari
function postElementPress(id, value) {
    let allIds = id.split('++');
    let elementId = allIds[0];
    let applianceId = allIds[allIds.length - 1];

    let pressHeaders = new Headers();
    pressHeaders.append("Authorization", `Bearer ${tokens.accessToken}`);
    pressHeaders.append("Content-Type", "application/json");

    let pressData;
    if (typeof value !== 'undefined') pressData = JSON.stringify({
        "applianceId": applianceId,
        "elementId": elementId,
        "value": value
    });
    else pressData = JSON.stringify({"applianceId": applianceId, "elementId": elementId});

    let pressOptions = {
        headers: pressHeaders,
        method: 'POST',
        body: pressData,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/appliance/element/press`, pressOptions)
        .then(response => response.text())
        .then(result => {
            updateFormData(result);
        })
        .catch(error => console.log('error', error));

}

//uprava zariadeni po odpovedi servera
function updateFormData(responseJSON) {
    let appliance = JSON.parse(responseJSON);
    let form = document.getElementById(appliance.name + "Form");
    let elements = appliance.control.elements;
    if (form != null) {
        for (let j in elements) {
            let current = elements[j];
            let currentElement = document.getElementById(current.elementId + '++' + appliance.id);
            //LABEL ✓
            //INPUT ✓ asi netreba, zmeni pouzivatel
            //TIMER asi netreba, zmeni pouzivatel
            //BUTTON,PLUS,MINUS ✓ netreba, nemeni sa
            //SLIDER ✓ nie je potrebne + nereaguje na setAttribute
            //TOGGLE, CHECK ✓ ale netreba, zmeni pouzivatel
            //RADIO ✓

            if (current.elementType === "CHECKBOX" || current.elementType === "RADIO" || current.elementType === "TOGGLE")
                currentElement.setAttribute('checked', current.value);

                // else if (current.elementType === "SLIDER")
                // currentElement.setAttribute('percent', current.value);

                // else if (current.elementType === "INPUT")
            // currentElement.setAttribute('value', current.value)

            else if (current.elementType === "LABEL" && current.value !== 'TIME')
                currentElement.setAttribute('value', current.value)

            let controlElements = elements[j].controlElements;
            for (let k in controlElements) {
                let currentControl = controlElements[k];
                let currentControlElement = document.getElementById(currentControl.elementId + '++' + current.elementId + '++' + appliance.id);

                if (currentControl.elementType === "CHECKBOX" || currentControl.elementType === "RADIO" || currentControl.elementType === "TOGGLE")
                    currentControlElement.setAttribute('checked', currentControl.value);

                    // else if (currentControl.elementType === "SLIDER")
                    // currentControlElement.setAttribute('percent', currentControl.value);

                    // else if (currentControl.elementType === "INPUT")
                // currentControlElement.setAttribute('value', currentControl.value)

                else if (currentControl.elementType === "LABEL" && currentControl.value !== 'TIME')
                    currentElement.setAttribute('value', current.value)
            }
        }
    }
}


//zobrazenie klavesnice a zmena input hodnoty
let input = '';
let idToRemove;
let isTimer;
changeInput = function (inputId, appliance, timer) {
    if (timer) isTimer = true;
    else isTimer = false;
    field = inputId;
    input = document.getElementById(field).getAttribute('value');
    let keyboard = document.createElement("a-entity");
    keyboard.id = appliance + "keyboard";
    idToRemove = keyboard.id;
    keyboard.setAttribute('a-keyboard', '');
    keyboard.setAttribute('scale', '10 10 10');
    keyboard.setAttribute('position', "-2.4 -1.2 0.75");
    keyboard.setAttribute('rotation', "-25 0 0");

    document.getElementById(appliance + "Form").appendChild(keyboard);

    let label = document.createElement("a-gui-label");
    label.id = appliance + "keyboard" + "Label";
    label.setAttribute('value', input);
    label.setAttribute('opacity', '0.75');
    label.setAttribute('width', '0.8');
    label.setAttribute('height', '0.18');
    label.setAttribute('font-size', '54px');
    label.setAttribute('font-color', '#fff');
    label.setAttribute('font-weight', 'bold');
    label.setAttribute('font-family', 'monoid');
    label.setAttribute('background-color', '#4a4a4a');
    label.setAttribute('scale', '2 2 2');
    label.setAttribute('position', `0 -0.8 0.75`);
    label.setAttribute('rotation', `-25 0 0`);

    document.getElementById(appliance + "Form").appendChild(label);
}

function updateInputs(e) {
    document.getElementById(field).setAttribute("border-color", "#0E53A7");
    let label = document.getElementById(idToRemove + "Label");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            input = input.slice(0, -1);
            document.getElementById(field).setAttribute('value', input + '_');
            label.setAttribute('value', input + '_');
            if (isTimer) resetStartingTime(field);
            break;
        case 24:
            input = '';
            document.getElementById(field).setAttribute('value', input + '_');
            label.setAttribute('value', input + '_');
            if (isTimer) resetStartingTime(field);
            break;
        case 6:
            document.getElementById(idToRemove).remove();
            label.remove();
            document.getElementById(field).setAttribute('value', input);
            resetStartingTime(field);
            label.setAttribute('value', input);
            document.getElementById(field).setAttribute("border-color", "silver");

            if (isTimer) resetStartingTime(field);
            else postElementPress(field, input);
            input = '';
            break;
        default:
            input = input + e.detail.value;
            document.getElementById(field).setAttribute('value', input + '_');
            label.setAttribute('value', input + '_');
            if (isTimer) resetStartingTime(field);
            break;
    }
}


//potvrdenie prijatia aplikacie
function confirmGettingAppliance() {
    generateSpeechCommands(createdAppliance);
}

//TEST funkcionalita pre update/post zariadenia
function getDataUpdate() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);
    headers.append("Content-Type", "application/json");

    const newAppliance =
        {
            "id": "db7844d0-7aeb-4959-8915-3bc661eb1f50",
            "name": "Speaker",
            "description": "v spalni",
            "owner": {
                "id": "d2e9f83d-8d23-4a5b-ad2e-266e12565eda",
                "userType": "USER",
                "username": "test",
                "mail": "test@gmail.com",
                "firstname": "Test",
                "lastname": "Test",
                "displayName": "Test Test"
            },
            "control": {
                "name": "ovladac speaker",
                "elements": [{
                    "id": 8187,
                    "elementType": "BUTTON",
                    "value": "PLAY ►",
                    "valueType": "STRING",
                    "name": "playSound",
                    "elementId": "Speaker2",
                    "elementAccess": "FULL",
                    "style": {
                        "positionX": "-0.615",
                        "positionY": "-1",
                        "sizeX": "1.245",
                        "sizeY": "0.5",
                        "background-color": "#f5f7fa",
                        "active-color": "#0E53A7"
                    },
                    "controlElements": []
                }, {
                    "id": 8184,
                    "elementType": "LABEL",
                    "value": "25",
                    "valueType": "NUMBER",
                    "name": "volume label",
                    "elementId": "Speaker1",
                    "elementAccess": "FULL",
                    "style": {
                        "positionX": "0",
                        "positionY": "-0.5",
                        "sizeX": "1.1",
                        "sizeY": "0.5",
                        "background-color": "#f5f7fa",
                        "active-color": "#0E53A7"
                    },
                    "controlElements": [{
                        "id": 8186,
                        "elementType": "PLUS",
                        "value": "VOL+",
                        "valueType": "NUMBER",
                        "name": "volume plus",
                        "elementId": "Speaker1b",
                        "elementAccess": "FULL",
                        "style": {
                            "positionX": "0.9",
                            "positionY": "-0.5",
                            "sizeX": "0.7",
                            "sizeY": "0.5",
                            "background-color": "#0E53A7",
                            "active-color": "#f5f7fa"
                        },
                        "controlElements": []
                    }, {
                        "id": 8185,
                        "elementType": "MINUS",
                        "value": "VOL-",
                        "valueType": "NUMBER",
                        "name": "volume minus",
                        "elementId": "Speaker1a",
                        "elementAccess": "FULL",
                        "style": {
                            "positionX": "-0.9",
                            "positionY": "-0.5",
                            "sizeX": "0.7",
                            "sizeY": "0.5",
                            "background-color": "#0E53A7",
                            "active-color": "#f5f7fa"
                        },
                        "controlElements": []
                    }]
                }, {
                    "id": 8182,
                    "elementType": "LABEL",
                    "value": "ON",
                    "valueType": "STRING",
                    "name": "power label",
                    "elementId": "Speaker0",
                    "elementAccess": "FULL",
                    "style": {
                        "positionX": "-0.5",
                        "positionY": "0",
                        "sizeX": "1.5",
                        "sizeY": "0.5",
                        "background-color": "#f5f7fa",
                        "active-color": "#0E53A7"
                    },
                    "controlElements": [{
                        "id": 8183,
                        "elementType": "TOGGLE",
                        "value": "true",
                        "valueType": "BOOLEAN",
                        "name": "power on/off",
                        "elementId": "Speaker0a",
                        "elementAccess": "FULL",
                        "style": {
                            "positionX": "0.75",
                            "positionY": "0",
                            "sizeX": "1",
                            "sizeY": "0.5",
                            "background-color": "#f5f7fa",
                            "active-color": "#0E53A7"
                        },
                        "controlElements": []
                    }]
                }, {
                    "id": 8188,
                    "elementType": "BUTTON",
                    "value": "PAUSE ❚❚",
                    "valueType": "STRING",
                    "name": "pauseSound",
                    "elementId": "Speaker3",
                    "elementAccess": "FULL",
                    "style": {
                        "positionX": "0.615",
                        "positionY": "-1",
                        "sizeX": "1.245",
                        "sizeY": "0.5",
                        "background-color": "#f5f7fa",
                        "active-color": "#0E53A7"
                    },
                    "controlElements": []
                }]
            },
            "serialNumber": "eerer",
            "onlineStatus": "OFFLINE",
            "onlineStatusChangedAt": null
        }

    let
        postOptions = {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify(newAppliance),
            redirect: 'follow'
        };

    fetch("https://bp-smart-env-api.herokuapp.com/home/appliance", postOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            console.log(responseJSON);
        })
        .catch(error => console.log('error', error));
}





