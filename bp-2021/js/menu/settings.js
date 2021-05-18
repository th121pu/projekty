//prechod do NASTAVENI z menu
function toSettings() {
    window.location.hash = "settings";
    let worldPos;
    if (menuPosition) worldPos = menuPosition;
    else worldPos = getCameraWorldPosition();
    let cameraRotation = getCameraWorldRotation();

    setTimeout(function () {
        document.getElementById('settingsForm').setAttribute('position', `${worldPos.x} ${1.5} ${worldPos.z}`);
        document.getElementById('settingsForm').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
    }, 50);
}

function changeHome() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/joined`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            generateHomes(responseJSON);
        })
        .catch(error => console.log('error', error));

}

let homeSize;
let startHome;

function generateHomes(homes) {
    window.location.hash = "changeHome";
    homeSize = homes.length;

    setTimeout(function () {
        let worldPos;
        if (menuPosition) worldPos = menuPosition;
        else worldPos = getCameraWorldPosition();
        let cameraRotation = getCameraWorldRotation();
        let homesForm = document.getElementById('homesForm');
        homesForm.innerHTML = '';
        let title = document.createElement('a-troika-text');
        title.setAttribute('value', 'Domácnosti');
        title.setAttribute('font-size', '0.15');
        title.setAttribute('color', '#0E53A7');
        title.setAttribute('align', 'center');
        title.setAttribute('position', '0 0.625 0');
        title.setAttribute('font', "assets/fonts/font.ttf");

        let icon = document.createElement('a-gui-icon-button');
        icon.setAttribute('height', "0.12");
        icon.setAttribute('onclick', 'toSettings()');
        icon.setAttribute('background-color', '#0E53A7');
        icon.setAttribute('hover-color', 'white');
        icon.setAttribute('position', '-0.61 -0.006 0');
        icon.setAttribute('icon-font-size', '90px');
        icon.setAttribute('class', 'clickable');
        icon.setAttribute('icon', "android-arrow-back");

        let iconX = document.createElement('a-gui-icon-button');
        iconX.setAttribute('height', "0.12");
        iconX.setAttribute('onclick', 'goHome()');
        iconX.setAttribute('background-color', '#0E53A7');
        iconX.setAttribute('hover-color', 'white');
        iconX.setAttribute('position', '0.61 -0.006 0');
        iconX.setAttribute('icon-font-size', '90px');
        iconX.setAttribute('class', 'clickable');
        iconX.setAttribute('icon', "close-round");

        let iconAdd = document.createElement('a-gui-icon-button');
        iconAdd.setAttribute('height', "0.2");
        iconAdd.setAttribute('onclick', 'toAddHome()');
        iconAdd.setAttribute('background-color', '#0E53A7');
        iconAdd.setAttribute('hover-color', 'white');
        iconAdd.setAttribute('icon-font-size', '140px');
        iconAdd.setAttribute('class', 'clickable');
        iconAdd.setAttribute('icon', "android-add");
        iconAdd.setAttribute('position', '0 -1.75 0');

        title.appendChild(iconAdd);


        title.appendChild(icon);
        title.appendChild(iconX);
        homesForm.appendChild(title);

        for (let i = 0; i < homes.length; i++) {
            let home = homes[i];
            let el = document.createElement('a-gui-label');
            el.setAttribute('value', home.name);
            el.setAttribute('height', '0.25');
            el.setAttribute('width', '1.4');
            el.setAttribute('align', 'left');
            el.setAttribute('font-size', '64px');
            el.setAttribute('font-weight', '400');
            el.setAttribute('background-color', "white");
            el.setAttribute('hover-color', "white");
            if (currentHome === home.id)
                el.setAttribute('font-color', "#0E53A7");
            else el.setAttribute('font-color', "black");

            el.id = i.toString();
            let x = -(i % 5);
            el.setAttribute('position', `0 ${x * 0.3 + 0.35} 0`);
            if (i >= 0 && i <= 4)
                el.setAttribute('visible', true)
            else el.setAttribute('visible', false)


            let button1 = document.createElement('a-gui-icon-button');
            button1.setAttribute('height', "0.15")
            button1.setAttribute('icon', "android-arrow-forward");
            button1.setAttribute('icon-font-size', "90px");
            button1.setAttribute('onclick', "switchHome('" + home.id + "')");
            if (currentHome === home.id) button1.setAttribute('background-color', "#e8e8e8");
            else {
                button1.setAttribute('class', "clickable");
                button1.setAttribute('background-color', "#0E53A7");
            }
            if (i >= 0 && i <= 4) {
                button1.setAttribute('position', "0.35 0 0")
            } else button1.setAttribute('position', "0.35 0 -1")
            button1.setAttribute('font-color', "white");
            el.appendChild(button1);

            let button2 = document.createElement('a-gui-icon-button');
            button2.setAttribute('height', "0.15")
            button2.setAttribute('icon', "android-delete");
            button2.setAttribute('class', "clickable");
            button2.setAttribute('background-color', "#DC143C");
            button2.setAttribute('icon-font-size', "90px");
            button2.setAttribute('onclick', "deleteHomeModal('" + home.id + "')");
            button2.setAttribute('font-color', "white");
            if (i >= 0 && i <= 4) {
                button2.setAttribute('position', "0.55 0 0")
            } else button2.setAttribute('position', "0.55 0 -1")

            el.appendChild(button2);
            homesForm.appendChild(el);
        }

        startHome = 0;
        let buttonBack = document.createElement('a-gui-icon-button');
        buttonBack.id = 'buttonBack';
        buttonBack.setAttribute('height', "0.2");
        buttonBack.setAttribute('position', "-0.85 -0.25 0");
        buttonBack.setAttribute('icon', "arrow-left-a");
        buttonBack.setAttribute('icon-font-size', "110px");
        buttonBack.setAttribute('onclick', "homesFromToBack()");
        buttonBack.setAttribute('background-color', "#0E53A7");
        buttonBack.setAttribute('font-color', "white");
        buttonBack.setAttribute('visible', "false");
        homesForm.appendChild(buttonBack);

        let buttonNext = document.createElement('a-gui-icon-button');
        buttonNext.id = 'buttonNext';
        buttonNext.setAttribute('height', "0.2");
        buttonNext.setAttribute('position', "0.85 -0.25 0");
        buttonNext.setAttribute('icon', "arrow-right-a");
        buttonNext.setAttribute('class', "clickable");
        buttonNext.setAttribute('icon-font-size', "110px");
        buttonNext.setAttribute('onclick', "homesFromToNext()");
        buttonNext.setAttribute('background-color', "#0E53A7");
        buttonNext.setAttribute('font-color', "white");
        if (homeSize > startHome + 5) buttonNext.setAttribute('visible', "true");
        else buttonNext.setAttribute('visible', "false");
        homesForm.appendChild(buttonNext);

        homesForm.setAttribute('position', `${worldPos.x} ${1.5} ${worldPos.z}`);
        homesForm.setAttribute('rotation', `0 ${cameraRotation.y} 0`);
    }, 150);
}

//tlacidlo spat v zoznamie domacnosti
function homesFromToBack() {
    startHome = startHome - 5;
    refreshHomes();
}

//tlacidlo dalej v zoznamie domacnosti
function homesFromToNext() {
    startHome = startHome + 5;
    refreshHomes();
}

//update tlacidiel na prechod v zozname domov
function refreshHomes() {
    for (let i = 0; i < homeSize; i++) {
        let current = document.getElementById(i.toString());
        let children = Array.from(current.childNodes);
        if (i >= startHome && i <= startHome + 4) {
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
    if (startHome > 0) {
        back.setAttribute('class', "clickable");
        back.setAttribute('visible', "true");
    }
    else {
        back.setAttribute('visible', "false");
        back.setAttribute('class', "");
    }

    let next = document.getElementById('buttonNext');
    if (homeSize > startHome + 5) {
        next.setAttribute('class', "clickable");
        next.setAttribute('visible', "true");
    }
    else {
        next.setAttribute('visible', "false");
        next.setAttribute('class', "");
    }
}


//ZMENA DOMACNOSTI a prejdenie do NEJ
function switchHome(id) {
    currentHome = id;
    getHomeAppliances();
    document.getElementById("router-view").innerHTML =
        document.getElementById("template-home").innerHTML;

}

//MODAL pre potvrdenie zmazania vybratej domacnosti
function deleteHomeModal(id) {
    modalMessage('Odstrániť domácnosť?', "deleteHome('" + id + "')", 'homesForm');
}

//zmazanie vybratej domacnosti
function deleteHome(id) {
    document.getElementById('modalOdstrániť domácnosť?').remove();

    // delete MEMBER from HOME
    let deleteh = new Headers();
    deleteh.append("Authorization", `Bearer ${tokens.accessToken}`);

    let requestOptions = {
        method: 'DELETE',
        headers: deleteh,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/home/" + id, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'homesForm');
            } else changeHome();
        })
        .catch(error => {
            console.log('error', error);
        });
}


//vyvorenie novej domacnosti
function toAddHome() {
    setTimeout(function () {
        window.location.hash = "addHome";
        let worldPos;
        if (menuPosition) worldPos = menuPosition;
        else worldPos = getCameraWorldPosition();
        let cameraRotation = getCameraWorldRotation()
        cameraRotation.z = 0;
        cameraRotation.x = 0;
        setTimeout(function () {
            document.getElementById('addHomeEl').setAttribute('position', `${worldPos.x} ${1.9} ${worldPos.z}`);
            document.getElementById('addHomeEl').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
            document.getElementById('addHomeTitle').setAttribute('position', `${worldPos.x} ${2.6} ${worldPos.z}`);
            document.getElementById('addHomeTitle').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
        }, 10);

    }, 100);
    field = 'homeName';
}


//klavesnica pre vytvorenie domacnosti
let homeName = '';
let homeDesc = '';

function updateHome(e) {
    document.getElementById(field).setAttribute("font-color", "black");
    document.getElementById(field).setAttribute("border-color", "#0E53A7");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            if (field === 'homeName')
                homeName = homeName.slice(0, -1);
            else if (field === 'homeDesc')
                homeDesc = homeDesc.slice(0, -1);
            break;
        case 24:
            eval(field + '= ""');
            break;
        case 6:
            buttonAddHome();
            break;
        default:
            if (field === 'homeName')
                homeName = homeName + e.detail.value;
            else if (field === 'homeDesc')
                homeDesc = homeDesc + e.detail.value;
            break;
    }

     document.getElementById(field).setAttribute('value', eval(field) + '_');
}

function toHomeChange(name) {
    let elNew;
    let elOld;
    if (name === 'homeName') {
        elNew = document.getElementById("homeName");
        elOld = document.getElementById("homeDesc");
        field = 'homeName';
        if (homeDesc !== "") elOld.setAttribute("value", homeDesc);
        else elOld.setAttribute("font-color", "silver");
    }

    if (name === 'homeDesc') {
        elNew = document.getElementById("homeDesc");
        elOld = document.getElementById("homeName");
        field = 'homeDesc';
        if (homeName !== "") elOld.setAttribute("value", homeName);
        else elOld.setAttribute("font-color", "silver");
    }

    elNew.setAttribute("font-color", "black");
    elNew.setAttribute("border-color", "#0E53A7");
    elOld.setAttribute("border-color", "silver");

}

// create HOME
function buttonAddHome() {
    let raw = JSON.stringify({"name": homeName, "description": homeDesc});
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);
    headers.append("Content-Type", "application/json");
    let requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/home", requestOptions)
        .then(response => {
            if (response.ok) return response.json();
            else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .then(responseJSON => {
            homeName = '';
            homeDesc = '';
            changeHome();
        })
        .catch(error => {
            console.log('error', error);
        });

}