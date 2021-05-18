//prechod do CLENOVIA z menu a ziskanie vsetkych clenov domacnosti zo servera
function toUsers() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/${currentHome}`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            generateUsers(responseJSON.homeMembers);
        })
        .catch(error => console.log('error', error));

}

//generovanie HTML clenov domacnosti
function generateUsers(users) {
    window.location.hash = "users";
    let worldPos;
    if (menuPosition) worldPos = menuPosition;
    else worldPos = getCameraWorldPosition();
    let cameraRotation = getCameraWorldRotation();
    let userForm;

    setTimeout(function () {
        userForm = document.getElementById('usersForm');
        userForm.innerHTML = '';
        let title = document.createElement('a-troika-text');
        title.setAttribute('value', 'Členovia');
        title.setAttribute('font-size', '0.15');
        title.setAttribute('color', '#0E53A7');
        title.setAttribute('align', 'center');
        title.setAttribute('position', '0 0.625 0');
        title.setAttribute('font', "assets/fonts/font.ttf");

        let icon = document.createElement('a-gui-icon-button');
        icon.setAttribute('height', "0.14");
        icon.setAttribute('onclick', 'goMenu()');
        icon.setAttribute('background-color', '#0E53A7');
        icon.setAttribute('hover-color', 'white');
        icon.setAttribute('position', '-0.725 -0.015 0');
        icon.setAttribute('icon-font-size', '95px');
        icon.setAttribute('class', 'clickable');
        icon.setAttribute('icon', "android-arrow-back");

        let iconX = document.createElement('a-gui-icon-button');
        iconX.setAttribute('height', "0.14");
        iconX.setAttribute('onclick', 'goHome()');
        iconX.setAttribute('background-color', '#0E53A7');
        iconX.setAttribute('hover-color', 'white');
        iconX.setAttribute('position', '0.725 -0.015 0');
        iconX.setAttribute('icon-font-size', '95px');
        iconX.setAttribute('class', 'clickable');
        iconX.setAttribute('icon', "close-round");

        title.appendChild(icon);
        title.appendChild(iconX);
        userForm.appendChild(title);
    }, 50);

    setTimeout(function () {

        for (let i in users) {
            let user = users[i];

            let el = document.createElement('a-gui-label');
            let access;
            if (user.accessRights === 'FULL') access = '(F)'
            else access = '(R)'
            el.setAttribute('value', user.displayName + " " + access);
            el.setAttribute('height', '0.25');
            el.setAttribute('width', '1.6');
            el.setAttribute('align', 'left');
            el.setAttribute('font-size', '64px');
            el.setAttribute('font-weight', '400');
            el.setAttribute('margin', "0 0 0.05 0");
            el.setAttribute('background-color', "white");
            el.setAttribute('hover-color', "white");
            if (currentUser === user.id)
                el.setAttribute('font-color', "#0E53A7");
            else el.setAttribute('font-color', "black");

            let button1 = document.createElement('a-gui-icon-button');
            button1.setAttribute('height', "0.15")
            button1.setAttribute('position', "0.45 0 0")
            button1.setAttribute('icon', "android-hand");
            button1.setAttribute('class', "clickable");
            button1.setAttribute('icon-font-size', "90px");
            button1.setAttribute('onclick', "changeAccessModal('" + user.id + "' , '" + user.accessRights + "')");
            button1.setAttribute('background-color', "#0E53A7");
            button1.setAttribute('font-color', "white");
            el.appendChild(button1);

            let button2 = document.createElement('a-gui-icon-button');
            button2.setAttribute('height', "0.15")
            button2.setAttribute('position', "0.65 0 0")
            button2.setAttribute('icon', "android-delete");
            button2.setAttribute('class', "clickable");
            button2.setAttribute('icon-font-size', "90px");
            button2.setAttribute('onclick', "deleteUserModal('" + user.id + "')");
            button2.setAttribute('background-color', "#DC143C");
            button2.setAttribute('font-color', "white");
            el.appendChild(button2);

            userForm.appendChild(el);
        }

        let iconAdd = document.createElement('a-gui-icon-button');
        iconAdd.setAttribute('height', "0.2");
        iconAdd.setAttribute('onclick', 'toAddUser()');
        iconAdd.setAttribute('background-color', '#0E53A7');
        iconAdd.setAttribute('hover-color', 'white');
        iconAdd.setAttribute('icon-font-size', '140px');
        iconAdd.setAttribute('class', 'clickable');
        iconAdd.setAttribute('icon', "android-add");

        userForm.appendChild(iconAdd);

        userForm.setAttribute('position', `${worldPos.x} ${1.5} ${worldPos.z}`);
        userForm.setAttribute('rotation', `0 ${cameraRotation.y} 0`);
    }, 150);
}

//zmena pristupovych prav vybrateho clena domacnosti
function changeAccessModal(id, rights) {
    if (rights === 'FULL') rights = 'RESTRICTED';
    else rights = 'FULL';
    modalMessage("Zmeniť na " + rights + "?", "changeAccess('" + id + "' , '" + rights + "')", 'usersForm');
}


function changeAccess(id, rights) {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);
    headers.append("Content-Type", "application/json");

    let requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/access-rights/" + currentHome + "/" + id + "/" + rights, requestOptions)
        .then(response => {
            if (response.ok) {
                toUsers();
            } else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .catch(error => {
            console.log('error', error);
            alertMessage('Nemáte práva!', 'error', 'usersForm');
        });
}

//MODAL pre potvrdenie zmazania vybrateho clena z domacnosti
function deleteUserModal(id) {
    modalMessage('Odstrániť užívateľa?', "deleteUser('" + id + "')", 'usersForm');
}

//zmazanie vybrateho clena z domacnosti
function deleteUser(id) {
    document.getElementById('modalOdstrániť užívateľa?').remove();

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

    fetch("https://bp-smart-env-api.herokuapp.com/home/member/remove", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'usersForm');
            } else toUsers();
        })
        .catch(error => {
            console.log('error', error);
        });
}

let userSize;
let userStart;

function toAddUser() {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let getOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/users/${currentHome}/not-members?page=0&size=1000`, getOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            generateAddUser(responseJSON.data);
        })
        .catch(error => console.log('error', error));


}

//generovanie HTML NEclenov domacnosti
function generateAddUser(users) {
    window.location.hash = "addUser";
    userSize = users.length;

    setTimeout(function () {
        let worldPos;
        if (menuPosition) worldPos = menuPosition;
        else worldPos = getCameraWorldPosition();
        let cameraRotation = getCameraWorldRotation();
        let userForm = document.getElementById('addUserForm');

        userForm.innerHTML = '';
        let title = document.createElement('a-troika-text');
        title.setAttribute('value', 'Pridaj člena');
        title.setAttribute('font-size', '0.15');
        title.setAttribute('color', '#0E53A7');
        title.setAttribute('align', 'center');
        title.setAttribute('position', '0 0.625 0');
        title.setAttribute('font', "assets/fonts/font.ttf");

        let icon = document.createElement('a-gui-icon-button');
        icon.setAttribute('height', "0.12");
        icon.setAttribute('onclick', 'toUsers()');
        icon.setAttribute('background-color', '#0E53A7');
        icon.setAttribute('hover-color', 'white');
        icon.setAttribute('position', '-0.625 -0.015 0');
        icon.setAttribute('icon-font-size', '90px');
        icon.setAttribute('class', 'clickable');
        icon.setAttribute('icon', "android-arrow-back");

        let iconX = document.createElement('a-gui-icon-button');
        iconX.setAttribute('height', "0.12");
        iconX.setAttribute('onclick', 'goHome()');
        iconX.setAttribute('background-color', '#0E53A7');
        iconX.setAttribute('hover-color', 'white');
        iconX.setAttribute('position', '0.625 -0.015 0');
        iconX.setAttribute('icon-font-size', '90px');
        iconX.setAttribute('class', 'clickable');
        iconX.setAttribute('icon', "close-round");

        title.appendChild(icon);
        title.appendChild(iconX);
        userForm.appendChild(title);


        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let el = document.createElement('a-gui-label');
            el.setAttribute('value', user.displayName);
            el.setAttribute('height', '0.25');
            el.setAttribute('width', '1.4');
            el.setAttribute('align', 'left');
            el.setAttribute('font-size', '64px');
            el.setAttribute('font-weight', '400');
            el.setAttribute('margin', "0 0 0.05 0");
            el.setAttribute('background-color', "white");
            el.setAttribute('hover-color', "white");

            el.id = i.toString();
            let x = -(i % 5);
            el.setAttribute('position', `0 ${x * 0.3 + 0.3} 0`);
            if (i >= 0 && i <= 4)
                el.setAttribute('visible', true)
            else el.setAttribute('visible', false)

            let button2 = document.createElement('a-gui-icon-button');
            button2.setAttribute('height', "0.15")
            button2.setAttribute('position', "0.55 0 0")
            button2.setAttribute('icon', "android-add");
            button2.setAttribute('icon-font-size', "90px");
            button2.setAttribute('onclick', "addUserModal('" + user.id + "')");
            if (i >= 0 && i <= 4) {
                button2.setAttribute('position', "0.55 0 0")
            } else button2.setAttribute('position', "0.55 0 -1")

            button2.setAttribute('background-color', "#0E53A7");
            button2.setAttribute('class', "clickable");
            button2.setAttribute('font-color', "white");
            el.appendChild(button2);

            userForm.appendChild(el);
        }


        userStart = 0;
        let buttonBack = document.createElement('a-gui-icon-button');
        buttonBack.id = 'buttonBack';
        buttonBack.setAttribute('height', "0.2");
        buttonBack.setAttribute('position', "-0.9 -0.3 0");
        buttonBack.setAttribute('icon', "arrow-left-a");
        buttonBack.setAttribute('icon-font-size', "90px");
        buttonBack.setAttribute('onclick', "usersFromToBack()");
        buttonBack.setAttribute('background-color', "#0E53A7");
        buttonBack.setAttribute('font-color', "white");
        buttonBack.setAttribute('visible', "false");
        userForm.appendChild(buttonBack);

        let buttonNext = document.createElement('a-gui-icon-button');
        buttonNext.id = 'buttonNext';
        buttonNext.setAttribute('height', "0.2");
        buttonNext.setAttribute('position', "0.9 -0.3 0");
        buttonNext.setAttribute('icon', "arrow-right-a");
        buttonNext.setAttribute('class', "clickable");
        buttonNext.setAttribute('icon-font-size', "90px");
        buttonNext.setAttribute('onclick', "usersFromToNext()");
        buttonNext.setAttribute('background-color', "#0E53A7");
        buttonNext.setAttribute('font-color', "white");
        if (userSize > userStart + 5) buttonNext.setAttribute('visible', "true");
        else buttonNext.setAttribute('visible', "false");
        userForm.appendChild(buttonNext);

        userForm.setAttribute('position', `${worldPos.x} ${1.5} ${worldPos.z}`);
        userForm.setAttribute('rotation', `0 ${cameraRotation.y} 0`);

    }, 50);


}

function usersFromToBack() {
    userStart = userStart - 5;
    refreshUsers();
}

//tlacidlo dalej v zoznamie zariadeni
function usersFromToNext() {
    userStart = userStart + 5;
    refreshUsers();
}

//uprava viditelnych zariadeni a tlacidiel na posun
function refreshUsers() {
    for (let i = 0; i < userSize; i++) {
        let current = document.getElementById(i.toString());
        let children = Array.from(current.childNodes);
        if (i >= userStart && i <= userStart + 4) {
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
    if (userStart > 0) {
        back.setAttribute('class', "clickable");
        back.setAttribute('visible', "true");
    } else {
        back.setAttribute('visible', "false");
        back.setAttribute('class', "");
    }

    let next = document.getElementById('buttonNext');
    if (userSize > userStart + 5) {
        next.setAttribute('class', "clickable");
        next.setAttribute('visible', "true");
    } else {
        next.setAttribute('visible', "false");
        next.setAttribute('class', "");
    }
}


function addUserModal(id) {
    modalMessage('Pridať člena?', "addUser('" + id + "')", 'addUserForm');
}

function addUser(id) {
    document.getElementById('modalPridať člena?').remove();


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

    fetch("https://bp-smart-env-api.herokuapp.com/home/member/add", requestOptions)
        .then(response => response.text())
        .then(result => {
            if (JSON.stringify(result).includes('faultType')) {
                alertMessage('Nemáte práva!', 'error', 'appliancesForm');
            } else toUsers();
        })
        .catch(error => {
            console.log('error', error);
        });
}
