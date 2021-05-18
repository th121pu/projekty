//generovanie hlasovych prikazov podla zariadeni domacnosti
function generateSpeechCommands(createdAppliance) {
    for (let i in createdAppliance) {
        let name = createdAppliance[i].name;
        let nameWithoutSpaces = name.replace(/\s/g, '');
        let speech = document.getElementById('links');
        speech.setAttribute('speech-command__' + nameWithoutSpaces, "command: show " + name.toLowerCase() + "; type: function; function: showApplianceSpeech+" + name)
    }

    setTimeout(function () {
        let event = new CustomEvent('startspeech');
        document.getElementById('annyang').dispatchEvent(event);
    }, 2500);
}

//zobrazenie zariadenisa
function showApplianceSpeech(appliance) {
    let form;
    if (window.location.href.indexOf("indexAR") == -1) {
        form = document.getElementById(appliance + "Form");
        changeFormPosition(form);
    }
    else {
        let result = createdAppliance.filter(app => app.name === appliance)[0];
        jsonToForm(result);
    }
}

function changeAR() {
    if (window.location.href.indexOf("indexAR") === -1) location.replace("./indexAR.html");
}

function changeVR() {
    if (window.location.href.indexOf("indexAR") !== -1) location.replace("./index.html");
}

//interacion for sound
function pauseMusic() {
    soundEntity.components.sound.pauseSound();
}

function playMusic() {
    soundEntity.components.sound.playSound();
}

//simulovane svetlo
function lightsOn() {
    document.getElementById('alllights').remove();

    let def1 = document.createElement('a-light');
    def1.id = 'def1';
    def1.setAttribute('type', "ambient");
    def1.setAttribute('color', "#BBB");
    let def2 = document.createElement('a-light');
    def2.id = 'def2';
    def2.setAttribute('type', "directional");
    def2.setAttribute('color', "#FFF");
    def2.setAttribute('intensity', "0.6");
    def2.setAttribute('position', "-0.5 1 1");
    document.getElementById('router-view').appendChild(def1);
    document.getElementById('router-view').appendChild(def2);
}

function lightsOff() {
    if (document.getElementById('alllights')) document.getElementById('alllights').remove();
    if (document.getElementById('def1')) document.getElementById('def1').remove();
    if (document.getElementById('def2')) document.getElementById('def2').remove();
    let light = document.createElement('a-light');
    light.id = 'alllights';
    light.setAttribute('type', 'point');
    light.setAttribute('position', "0 3.8 -1.25");
    light.setAttribute('intensity', "0.5");
    light.setAttribute('color', "grey");
    document.getElementById('router-view').appendChild(light);
}

//sucasny datum a cas
function currentDate() {
    if (document.getElementById('currentDate')) document.getElementById('currentDate').remove();
    let current = document.createElement('a-gui-label');
    let date = new Date();
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    current.id = 'currentDate';
    current.setAttribute('width', '1.4');
    current.setAttribute('font-size', '55px');
    current.setAttribute('height', '0.75');
    current.setAttribute('background-color', 'white');
    current.setAttribute('font-color', 'black');
    current.setAttribute('value', "Dátum: " + day + '.' + month + '.' + year);
    addBorders(current, '#0E53A7');

    let title = document.createElement('a-troika-text');
    title.setAttribute('position', '0 0.22 0.001');
    title.setAttribute('color', '#0E53A7');
    title.setAttribute('align', 'center');
    title.setAttribute('font-size', '0.15');
    title.setAttribute('value', date.getHours() + ":" + minutes);
    current.appendChild(title);

    let button = document.createElement('a-gui-button');
    button.setAttribute('value', 'OK');
    button.setAttribute('width', '0.3');
    button.setAttribute('height', '0.2');
    button.setAttribute('font-size', '60px');
    button.setAttribute('position', '0 -0.22 0');
    button.setAttribute('background-color', '#0E53A7');
    button.setAttribute('font-color', 'white');
    button.setAttribute('onclick', "closeDate()");
    button.setAttribute('class', "clickable");
    current.appendChild(button);

    document.getElementById('router-view').appendChild(current);
    changeFormPosition(current, true);
}

function closeDate() {
    document.getElementById('currentDate').remove();
}

//zobrazenie pocasie
function showWeather() {
    let container = document.createElement('a-gui-label');
    if (document.getElementById('weather')) document.getElementById('weather').remove();
    container.id = 'weather';
    let pos = getCameraWorldPosition();
    let rot = getCameraWorldRotation();
    rot.z = 0;
    rot.x = 0;
    createWeather(container);
    container.setAttribute('position', `${pos.x} ${1.6} ${pos.z}`);
    container.setAttribute('rotation', rot);
    document.getElementById('router-view').appendChild(container);
}

//pomoc
function displayHelp() {
    if (document.getElementById('help')) document.getElementById('help').remove();
    let help = document.createElement('a-gui-label');
    help.id = 'help';
    help.setAttribute('width', '1.8');
    help.setAttribute('font-size', '48px');
    help.setAttribute('height', '1.26');
    help.setAttribute('background-color', 'white');
    help.setAttribute('font-color', 'black');
    help.setAttribute('value', " ");

    let mainTitle = document.createElement('a-troika-text');
    mainTitle.setAttribute('position', '0 0.5 0.001');
    mainTitle.setAttribute('color', '#0E53A7');
    mainTitle.setAttribute('align', 'center');
    mainTitle.setAttribute('font-size', '0.15');
    mainTitle.setAttribute('value', 'Hlasové príkazy');
    help.appendChild(mainTitle);

    let title = document.createElement('a-troika-text');
    title.setAttribute('position', '-0.825 0.35 0.001');
    title.setAttribute('color', '#0E53A7');
    title.setAttribute('align', 'center');
    title.setAttribute('anchor', 'left');
    title.setAttribute('font-size', '0.1');
    title.setAttribute('value', 'show menu -');
    title.setAttribute('class', 'firstHelp');
    help.appendChild(title);

    let titleText = document.createElement('a-troika-text');
    titleText.setAttribute('position', '0.15 0.35 0.001');
    titleText.setAttribute('color', 'black');
    titleText.setAttribute('align', 'center');
    titleText.setAttribute('font-size', '0.1');
    titleText.setAttribute('value', 'zobrazenie menu');
    titleText.setAttribute('class', 'firstHelp');
    help.appendChild(titleText);

    let title2 = document.createElement('a-troika-text');
    title2.setAttribute('position', '-0.825 0.2 0.001');
    title2.setAttribute('color', '#0E53A7');
    title2.setAttribute('align', 'center');
    title2.setAttribute('anchor', 'left');
    title2.setAttribute('font-size', '0.1');
    title2.setAttribute('value', 'show users -');
    title2.setAttribute('class', 'firstHelp');
    help.appendChild(title2);

    let title2Text = document.createElement('a-troika-text');
    title2Text.setAttribute('position', '0.15 0.2 0.001');
    title2Text.setAttribute('color', 'black');
    title2Text.setAttribute('align', 'center');
    title2Text.setAttribute('font-size', '0.1');
    title2Text.setAttribute('font', "assets/fonts/font.ttf");
    title2Text.setAttribute('value', 'zobrazenie členov');
    title2Text.setAttribute('class', 'firstHelp');
    help.appendChild(title2Text);

    let title3 = document.createElement('a-troika-text');
    title3.setAttribute('position', '-0.825 0.05 0.001');
    title3.setAttribute('color', '#0E53A7');
    title3.setAttribute('align', 'center');
    title3.setAttribute('anchor', 'left');
    title3.setAttribute('font-size', '0.1');
    title3.setAttribute('value', 'show settings -');
    title3.setAttribute('class', 'firstHelp');
    help.appendChild(title3);

    let title3Text = document.createElement('a-troika-text');
    title3Text.setAttribute('position', '0.35 0.05 0.001');
    title3Text.setAttribute('color', 'black');
    title3Text.setAttribute('align', 'center');
    title3Text.setAttribute('font-size', '0.1');
    title3Text.setAttribute('font', "assets/fonts/font.ttf");
    title3Text.setAttribute('value', 'zobrazenie nastavení');
    title3Text.setAttribute('class', 'firstHelp');
    help.appendChild(title3Text);

    let title4 = document.createElement('a-troika-text');
    title4.setAttribute('position', '-0.825 -0.1 0.001');
    title4.setAttribute('color', '#0E53A7');
    title4.setAttribute('align', 'center');
    title4.setAttribute('anchor', 'left');
    title4.setAttribute('font-size', '0.1');
    title4.setAttribute('value', 'show appliances -');
    title4.setAttribute('class', 'firstHelp');
    help.appendChild(title4);

    let title4Text = document.createElement('a-troika-text');
    title4Text.setAttribute('position', '0.375 -0.1 0.001');
    title4Text.setAttribute('color', 'black');
    title4Text.setAttribute('align', 'center');
    title4Text.setAttribute('font-size', '0.1');
    title4Text.setAttribute('font', "assets/fonts/font.ttf");
    title4Text.setAttribute('value', 'zobraz. zariadení');
    title4Text.setAttribute('class', 'firstHelp');
    help.appendChild(title4Text);

    let title5 = document.createElement('a-troika-text');
    title5.setAttribute('position', '-0.825 -0.25 0.001');
    title5.setAttribute('color', '#0E53A7');
    title5.setAttribute('align', 'center');
    title5.setAttribute('anchor', 'left');
    title5.setAttribute('font-size', '0.1');
    title5.setAttribute('value', 'logout -');
    title5.setAttribute('class', 'firstHelp');
    help.appendChild(title5);

    let title5Text = document.createElement('a-troika-text');
    title5Text.setAttribute('position', '-0.22 -0.25 0.001');
    title5Text.setAttribute('color', 'black');
    title5Text.setAttribute('align', 'center');
    title5Text.setAttribute('font-size', '0.1');
    title5Text.setAttribute('font', "assets/fonts/font.ttf");
    title5Text.setAttribute('value', 'odhlásiť sa');
    title5Text.setAttribute('class', 'firstHelp');
    help.appendChild(title5Text);

    let title5b = document.createElement('a-troika-text');
    title5b.setAttribute('position', '-0.825 -0.4 0.001');
    title5b.setAttribute('color', '#0E53A7');
    title5b.setAttribute('align', 'center');
    title5b.setAttribute('anchor', 'left');
    title5b.setAttribute('font-size', '0.1');
    title5b.setAttribute('value', 'go to ar/vr -');
    title5b.setAttribute('class', 'firstHelp');
    help.appendChild(title5b);

    let title5bText = document.createElement('a-troika-text');
    title5bText.setAttribute('position', '0.04 -0.4 0.001');
    title5bText.setAttribute('color', 'black');
    title5bText.setAttribute('align', 'center');
    title5bText.setAttribute('font-size', '0.1');
    title5bText.setAttribute('font', "assets/fonts/font.ttf");
    title5bText.setAttribute('value', 'zmena režimu');
    title5bText.setAttribute('class', 'firstHelp');
    help.appendChild(title5bText);

    let iconX = document.createElement('a-gui-icon-button');
    iconX.setAttribute('height', "0.12");
    iconX.setAttribute('onclick', 'closeHelp()');
    iconX.setAttribute('background-color', '#0E53A7');
    iconX.setAttribute('hover-color', 'white');
    iconX.setAttribute('position', '0.77 0.5 0');
    iconX.setAttribute('icon-font-size', '105px');
    iconX.setAttribute('class', 'clickable');
    iconX.setAttribute('icon', "close-round");
    help.appendChild(iconX);

    let next = document.createElement('a-gui-icon-button');
    next.id = 'nextHelp';
    next.setAttribute('height', "0.15");
    next.setAttribute('onclick', 'nextHelp()');
    next.setAttribute('background-color', '#0E53A7');
    next.setAttribute('hover-color', 'white');
    next.setAttribute('position', '0 -0.53 0');
    next.setAttribute('icon-font-size', '92px');
    next.setAttribute('class', 'clickable');
    next.setAttribute('icon', "arrow-right-a");
    help.appendChild(next);

    let back = document.createElement('a-gui-icon-button');
    back.id = 'backHelp';
    back.setAttribute('height', "0.15");
    back.setAttribute('onclick', 'backHelp()');
    back.setAttribute('background-color', '#0E53A7');
    back.setAttribute('hover-color', 'white');
    back.setAttribute('position', '0 -0.53 0');
    back.setAttribute('icon-font-size', '92px');
    back.setAttribute('visible', 'false');
    back.setAttribute('icon', "arrow-left-a");
    help.appendChild(back);

    let title6 = document.createElement('a-troika-text');
    title6.setAttribute('position', '-0.825 0.35 0.001');
    title6.setAttribute('color', '#0E53A7');
    title6.setAttribute('align', 'center');
    title6.setAttribute('anchor', 'left');
    title6.setAttribute('font-size', '0.1');
    title6.setAttribute('value', 'show weather -');
    title6.setAttribute('class', 'secondHelp');
    title6.setAttribute('visible', 'false');
    help.appendChild(title6);

    let title6Text = document.createElement('a-troika-text');
    title6Text.setAttribute('position', '0.175 0.35 0.001');
    title6Text.setAttribute('color', 'black');
    title6Text.setAttribute('align', 'center');
    title6Text.setAttribute('font-size', '0.1');
    title6Text.setAttribute('value', 'zobr. počasie');
    title6Text.setAttribute('font', "assets/fonts/font.ttf");
    title6Text.setAttribute('class', 'secondHelp');
    title6Text.setAttribute('visible', 'false');
    help.appendChild(title6Text);

    let title7 = document.createElement('a-troika-text');
    title7.setAttribute('position', '-0.825 0.2 0.001');
    title7.setAttribute('color', '#0E53A7');
    title7.setAttribute('align', 'center');
    title7.setAttribute('anchor', 'left');
    title7.setAttribute('font-size', '0.1');
    title7.setAttribute('value', 'show current time/date -');
    title7.setAttribute('class', 'secondHelp');
    title7.setAttribute('visible', 'false');
    help.appendChild(title7);

    let title7Text = document.createElement('a-troika-text');
    title7Text.setAttribute('position', '0.525 0.2 0.001');
    title7Text.setAttribute('color', 'black');
    title7Text.setAttribute('align', 'center');
    title7Text.setAttribute('font-size', '0.1');
    title7Text.setAttribute('font', "assets/fonts/font.ttf");
    title7Text.setAttribute('value', 'čas/dátum');
    title7Text.setAttribute('class', 'secondHelp');
    title7Text.setAttribute('visible', 'false');
    help.appendChild(title7Text);

    let title8 = document.createElement('a-troika-text');
    title8.setAttribute('position', '-0.825 0.05 0.001');
    title8.setAttribute('color', '#0E53A7');
    title8.setAttribute('align', 'center');
    title8.setAttribute('anchor', 'left');
    title8.setAttribute('font-size', '0.1');
    title8.setAttribute('value', 'play/pause music -');
    title8.setAttribute('class', 'secondHelp');
    title8.setAttribute('visible', 'false');
    help.appendChild(title8);

    let title8Text = document.createElement('a-troika-text');
    title8Text.setAttribute('position', '0.425 0.05 0.001');
    title8Text.setAttribute('color', 'black');
    title8Text.setAttribute('align', 'center');
    title8Text.setAttribute('font-size', '0.1');
    title8Text.setAttribute('font', "assets/fonts/font.ttf");
    title8Text.setAttribute('value', 'ovládanie hudby');
    title8Text.setAttribute('class', 'secondHelp');
    title8Text.setAttribute('visible', 'false');
    help.appendChild(title8Text);

    let title9 = document.createElement('a-troika-text');
    title9.setAttribute('position', '-0.825 -0.1 0.001');
    title9.setAttribute('color', '#0E53A7');
    title9.setAttribute('align', 'center');
    title9.setAttribute('anchor', 'left');
    title9.setAttribute('font-size', '0.1');
    title9.setAttribute('value', 'show + "názov zariadenia"-');
    title9.setAttribute('class', 'secondHelp');
    title9.setAttribute('visible', 'false');
    help.appendChild(title9);

    let title9Text = document.createElement('a-troika-text');
    title9Text.setAttribute('position', '0.61 -0.1 0.001');
    title9Text.setAttribute('color', 'black');
    title9Text.setAttribute('align', 'center');
    title9Text.setAttribute('font-size', '0.1');
    title9Text.setAttribute('font', "assets/fonts/font.ttf");
    title9Text.setAttribute('value', 'zariadenie');
    title9Text.setAttribute('class', 'secondHelp');
    title9Text.setAttribute('visible', 'false');
    help.appendChild(title9Text);

    let title10 = document.createElement('a-troika-text');
    title10.setAttribute('position', '-0.825 -0.25 0.001');
    title10.setAttribute('color', '#0E53A7');
    title10.setAttribute('align', 'center');
    title10.setAttribute('anchor', 'left');
    title10.setAttribute('font-size', '0.1');
    title10.setAttribute('value', 'show help -');
    title10.setAttribute('class', 'secondHelp');
    title10.setAttribute('visible', 'false');
    help.appendChild(title10);

    let title10Text = document.createElement('a-troika-text');
    title10Text.setAttribute('position', '0.07 -0.25 0.001');
    title10Text.setAttribute('color', 'black');
    title10Text.setAttribute('align', 'center');
    title10Text.setAttribute('font-size', '0.1');
    title10Text.setAttribute('font', "assets/fonts/font.ttf");
    title10Text.setAttribute('value', 'hlasové príkazy');
    title10Text.setAttribute('class', 'secondHelp');
    title10Text.setAttribute('visible', 'false');
    help.appendChild(title10Text);

    let title10b = document.createElement('a-troika-text');
    title10b.setAttribute('position', '-0.825 -0.4 0.001');
    title10b.setAttribute('color', '#0E53A7');
    title10b.setAttribute('align', 'center');
    title10b.setAttribute('anchor', 'left');
    title10b.setAttribute('font-size', '0.1');
    title10b.setAttribute('value', 'lights on/off -');
    title10b.setAttribute('class', 'secondHelp');
    title10b.setAttribute('visible', 'false');
    help.appendChild(title10b);

    let title10bText = document.createElement('a-troika-text');
    title10bText.setAttribute('position', '0.26s -0.4 0.001');
    title10bText.setAttribute('color', 'black');
    title10bText.setAttribute('align', 'center');
    title10bText.setAttribute('font-size', '0.1');
    title10bText.setAttribute('font', "assets/fonts/font.ttf");
    title10bText.setAttribute('value', 'simul. zmena svetiel');
    title10bText.setAttribute('class', 'secondHelp');
    title10bText.setAttribute('visible', 'false');
    help.appendChild(title10bText);

    let borderTopEntity = document.createElement("a-entity");
    borderTopEntity.setAttribute('geometry', 'primitive: box; width: ' + 1.8 + '; height: 0.01; depth: 0.02;');
    borderTopEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + '#0E53A7');
    borderTopEntity.setAttribute('position', '0 -' + (1.26 / 2 - 0.005) + ' 0.01');
    help.appendChild(borderTopEntity);
    let borderBottomEntity = document.createElement("a-entity");
    borderBottomEntity.setAttribute('geometry', 'primitive: box; width: ' + 1.8 + '; height: 0.01; depth: 0.02;');
    borderBottomEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + '#0E53A7');
    borderBottomEntity.setAttribute('position', '0 ' + (1.26 / 2 - 0.005) + ' 0.01');
    help.appendChild(borderBottomEntity);
    let borderLeftEntity = document.createElement("a-entity");
    borderLeftEntity.setAttribute('geometry', 'primitive: box; width: 0.01; height: ' + 1.26 + '; depth: 0.02;');
    borderLeftEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + '#0E53A7');
    borderLeftEntity.setAttribute('position', '-' + (1.8 / 2 - 0.005) + ' 0 0.01');
    help.appendChild(borderLeftEntity);
    let borderRightEntity = document.createElement("a-entity");
    borderRightEntity.setAttribute('geometry', 'primitive: box; width: 0.01; height: ' + 1.26 + '; depth: 0.02;');
    borderRightEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + '#0E53A7');
    borderRightEntity.setAttribute('position', 1.8 / 2 - 0.005 + ' 0 0.01');
    help.appendChild(borderRightEntity);

    document.getElementById('router-view').appendChild(help);
    changeFormPosition(help, true);
}

function nextHelp() {
    let old = document.getElementsByClassName("firstHelp");
    for (let i = 0; i < old.length; i++) {
        old[i].setAttribute('visible', 'false');
    }
    document.getElementById('nextHelp').setAttribute('class', '');
    document.getElementById('nextHelp').setAttribute('visible', 'false');

    let show = document.getElementsByClassName("secondHelp");
    for (let i = 0; i < show.length; i++) {
        show[i].setAttribute('visible', 'true');
    }
    document.getElementById('backHelp').setAttribute('class', 'clickable');
    document.getElementById('backHelp').setAttribute('visible', 'true');
}

function backHelp() {
    let old = document.getElementsByClassName("secondHelp");
    for (let i = 0; i < old.length; i++) {
        old[i].setAttribute('visible', 'false');
    }
    document.getElementById('backHelp').setAttribute('class', '');
    document.getElementById('backHelp').setAttribute('visible', 'false');

    let show = document.getElementsByClassName("firstHelp");
    for (let i = 0; i < show.length; i++) {
        show[i].setAttribute('visible', 'true');
    }
    document.getElementById('nextHelp').setAttribute('class', 'clickable');
    document.getElementById('nextHelp').setAttribute('visible', 'true');
}

function closeHelp() {
    document.getElementById('help').remove();
}

//pridanie okrajov
function addBorders(el, color) {
    let borderTopEntity = document.createElement("a-entity");
    borderTopEntity.setAttribute('geometry', 'primitive: box; width: ' + 1.4 + '; height: 0.01; depth: 0.02;');
    borderTopEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + color);
    borderTopEntity.setAttribute('position', '0 -' + (0.75 / 2 - 0.005) + ' 0.01');
    el.appendChild(borderTopEntity);
    let borderBottomEntity = document.createElement("a-entity");
    borderBottomEntity.setAttribute('geometry', 'primitive: box; width: ' + 1.4 + '; height: 0.01; depth: 0.02;');
    borderBottomEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + color);
    borderBottomEntity.setAttribute('position', '0 ' + (0.75 / 2 - 0.005) + ' 0.01');
    el.appendChild(borderBottomEntity);
    let borderLeftEntity = document.createElement("a-entity");
    borderLeftEntity.setAttribute('geometry', 'primitive: box; width: 0.01; height: ' + 0.75 + '; depth: 0.02;');
    borderLeftEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + color);
    borderLeftEntity.setAttribute('position', '-' + (1.4 / 2 - 0.005) + ' 0 0.01');
    el.appendChild(borderLeftEntity);
    let borderRightEntity = document.createElement("a-entity");
    borderRightEntity.setAttribute('geometry', 'primitive: box; width: 0.01; height: ' + 0.75 + '; depth: 0.02;');
    borderRightEntity.setAttribute('material', 'shader: flat; opacity: 1; side:double; color: ' + color);
    borderRightEntity.setAttribute('position', 1.4 / 2 - 0.005 + ' 0 0.01');
    el.appendChild(borderRightEntity);
}

//zobrazenie formulara na spravnej pozicii
function changeFormPosition(form, noClick) {
    let camera = document.getElementById('cameraPosition');
    let worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(camera.object3D.matrixWorld);
    let cameraRotation = document.getElementById('cameraWrapper').getAttribute('rotation');
    cameraRotation.z = 0;
    cameraRotation.x = 0;

    setTimeout(function () {
        form.setAttribute('position', `${worldPos.x} ${1.6} ${worldPos.z}`);
        form.setAttribute('rotation', cameraRotation);
        form.setAttribute('visible', true);

        if (!noClick) {
            let children = Array.from(form.childNodes);
            for (let i = 0; i < children.length; i++) {
                children[i].classList.add('clickable')
            }
        }
    }, 50);
}