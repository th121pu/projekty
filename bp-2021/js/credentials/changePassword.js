//zobrazenie formulara pred kamerou
function showChangePassword() {
    setTimeout(function () {
        window.location.hash = "changePassword";

        let camera = document.getElementById('cameraPosition');
        let worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(camera.object3D.matrixWorld);

        let cameraRotation = document.getElementById('cameraWrapper').getAttribute('rotation');
        cameraRotation.z = 0;
        cameraRotation.x = 0;
        setTimeout(function () {
            document.getElementById('changePassEl').setAttribute('position', `${worldPos.x} ${2.3} ${worldPos.z}`);
            document.getElementById('changePassEl').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
            document.getElementById('changePassTitle').setAttribute('position', `${worldPos.x} ${3} ${worldPos.z}`);
            document.getElementById('changePassTitle').setAttribute('rotation', `0 ${cameraRotation.y} 0`);
        }, 10);

    }, 100);
    field = 'oldPass';
}

//klavesnica pre zmenu hesla
let oldPass = '';
let newPass = '';
let newPass2 = '';

function updateChange(e) {
    document.getElementById(field).setAttribute("font-color", "black");
    document.getElementById(field).setAttribute("border-color", "#0E53A7");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            if (field === 'oldPass')
                oldPass = oldPass.slice(0, -1);
            else if (field === 'newPass')
                newPass = newPass.slice(0, -1);
            else if (field === 'newPass2')
                newPass2 = newPass2.slice(0, -1);
            break;
        case 24:
            eval(field + '= ""');
            break;
        case 6:
            buttonChangePassword();
            break;
        default:
            if (field === 'oldPass')
                oldPass = oldPass + e.detail.value;
            else if (field === 'newPass')
                newPass = newPass + e.detail.value;
            else if (field === 'newPass2')
                newPass2 = newPass2 + e.detail.value;
            break;
    }

    if (document.getElementById(field).firstElementChild.getAttribute('icon') !== 'eye-disabled')
        document.getElementById(field).setAttribute('value', "•".repeat(eval(field).length) + '_');
    else document.getElementById(field).setAttribute('value', eval(field) + '_');
}

function toChange(name) {
    let elNew = document.getElementById(name);
    switchPass();
    field = name;
    elNew.setAttribute("font-color", "black");
    elNew.setAttribute("border-color", "#0e53a7");
    elNew.classList.remove('clickable');

    if (elNew.firstElementChild.lastElementChild) {
        elNew.firstElementChild.lastElementChild.setAttribute("material", "color: #0E53A7");
    }
}

function switchPass() {
    let elOld;
    elOld = document.getElementById(field);
    if (eval(field) !== "") {
        if (document.getElementById(field).firstElementChild.getAttribute('icon') !== 'eye-disabled')
            elOld.setAttribute("value", "•".repeat(eval(field).length));
        else elOld.setAttribute("value", eval(field));
    } else {
        elOld.setAttribute("font-color", "silver");
    }
    elOld.setAttribute("border-color", "silver");
    elOld.classList.add('clickable');

    if (elOld.firstElementChild.lastElementChild) {
        elOld.firstElementChild.lastElementChild.setAttribute("material", "color: #d3d3d4");
    }
}

//stlacenie tlacidla zmeny hesla a poziadavka na server
buttonChangePassword = function () {
    if (newPass !== newPass2 || newPass === "" || newPass2 === "") {
        newPass = '';
        newPass2 = '';
        document.getElementById('newPass').setAttribute('value', "Try again!");
        document.getElementById('newPass').setAttribute('font-color', "#DC143C");
        document.getElementById('newPass2').setAttribute('value', "Try again!");
        document.getElementById('newPass2').setAttribute('font-color', "#DC143C");
    } else if (oldPass === "") {
        oldPass = '';
        document.getElementById('oldPass').setAttribute('value', "Fill password!");
        document.getElementById('oldPass').setAttribute('font-color', "#dc143c");
    } else {
        let raw = JSON.stringify({
            "newPassword": newPass,
            "oldPassword": oldPass,
        });

        let newHeaders = new Headers();
        newHeaders.append("Authorization", `Bearer ${tokens.accessToken}`);
        newHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'PUT',
            headers: newHeaders,
            body: raw,
            redirect: 'follow'
        };


        fetch("https://bp-smart-env-api.herokuapp.com/auth/change-password", requestOptions)
            .then(response => response.text())
            .then(responseJSON => {
                tokens = responseJSON;
                if (JSON.stringify(responseJSON).includes('faultType')) {
                    alertMessage('Nesprávne údaje!', 'error', 'changePassEl');
                } else confirmPasswordChange();
                oldPass = '';
                newPass = '';
                newPass2 = '';
            })
            .catch(error => {
                alertMessage('Nesprávne údaje!', 'error', 'changePassEl');
                console.log('error', error)
            });
    }
}

//potvredenie a navrat do nastaveni
function confirmPasswordChange() {
    setTimeout(function () {
        toSettings();
    }, 100);
    inputUsername = '';
    inputPass = '';
}

