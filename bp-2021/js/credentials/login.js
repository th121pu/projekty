// klavesnica na login
let inputUsername = '';
let inputPass = '';
let field = '#username';
let tokens;

document.addEventListener('a-keyboard-update', updateInput);

function updateInput(e) {
    if (window.location.hash === "#login") {
        updateLogin(e);
    } else if (window.location.hash === "#register") {
        updateRegister(e);
    } else if (window.location.hash === "#reset") {
        updateReset(e);
    } else if (window.location.hash === "#changePassword") {
        updateChange(e);
    } else if (window.location.hash === "#home" || window.location.hash === "#devices") {
        updateInputs(e);
    } else if (window.location.hash === "#addHome") {
        updateHome(e);
    }
}

function updateLogin(e) {
    document.querySelector(field).setAttribute("font-color", "black");
    document.querySelector(field).setAttribute("border-color", "#0E53A7");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            if (field === '#username')
                inputUsername = inputUsername.slice(0, -1);
            else inputPass = inputPass.slice(0, -1);
            break;
        case 24:
            if (field === '#username')
                inputUsername = '';
            else inputPass = ''
            break;
        case 6:
            buttonLogin();
            break;
        default:
            if (field === '#username')
                inputUsername = inputUsername + e.detail.value;
            else inputPass = inputPass + e.detail.value;
            break;
    }
    if (field === '#username')
        document.querySelector(field).setAttribute('value', inputUsername + '_');
    else if (document.querySelector(field).firstElementChild.getAttribute('icon') === 'eye-disabled')
        document.querySelector(field).setAttribute('value', inputPass + '_');
    else document.querySelector(field).setAttribute('value', "•".repeat(inputPass.length) + '_');
}

function toUsername(number) {
    let elNew;
    let elOld;
    if (number === 0) {
        elNew = document.getElementById("password");
        elOld = document.getElementById("username");
        elNew.classList.remove('clickable');
        elOld.classList.add('clickable');
        field = '#password';
        if (inputUsername !== "") elOld.setAttribute("value", inputUsername);
        else elOld.setAttribute("font-color", "silver");
    }

    if (number === 1) {
        elNew = document.getElementById("username");
        elOld = document.getElementById("password");
        elNew.classList.remove('clickable');
        elOld.classList.add('clickable');
        field = '#username';
        if (inputPass !== "") elOld.setAttribute("value", "•".repeat(inputPass.length))
        else elOld.setAttribute("font-color", "silver");
    }

    elNew.setAttribute("font-color", "black");
    if (elNew.firstElementChild.lastElementChild) {
        elNew.firstElementChild.lastElementChild.setAttribute("material", "color: #0E53A7");
    }
    elNew.setAttribute("border-color", "#0E53A7");

    if (elOld.firstElementChild.lastElementChild) {
        elOld.firstElementChild.lastElementChild.setAttribute("material", "color: #d3d3d4");
    }
    elOld.setAttribute("border-color", "silver");

}


//tlacidlo Prihlasit sa
function buttonLogin() {
    login();
    setTimeout(function () {
        if (!document.getElementById('alertPrihlásenie neúspešné'))
            alertMessage('Počkajte prosím...', 'login', 'loginForm');
    }, 1000);
}

//prihlasenie poziadavka na server
let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");


function login() {
    let raw = JSON.stringify({"username": inputUsername, "password": inputPass});
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/auth/login/credentials", requestOptions)
        .then(response => {
            if (response.ok) return response.json();
            else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .then(responseJSON => {
            tokens = responseJSON;
            localStorage.setItem('refreshToken', tokens.refreshToken);
            confirmLogin();
        })
        .catch(error => {
            console.log('error', error);
            if (document.getElementById('alertPočkajte prosím...'))
                document.getElementById('alertPočkajte prosím...').remove();
            alertMessage('Prihlásenie neúspešné', 'error', 'loginForm');
        });
}


//prechod do domacnosti
function confirmLogin() {
    window.location.hash = "home";
    inputUsername = '';
    inputPass = '';
}


//login cez refresh token
loginRefreshToken();
document.querySelector('a-scene').addEventListener('loaded', function () {
    setTimeout(function () {
        if (document.getElementById('hidden'))
            document.getElementById('hidden').setAttribute('visible', true)
    }, 1000);
})

function loginRefreshToken() {
    let refresh = localStorage.getItem('refreshToken');
    if (refresh) {
        let raw = JSON.stringify({"refreshToken": refresh});
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://bp-smart-env-api.herokuapp.com/auth/login/refresh-token", requestOptions)
            .then(response => {
                if (response.ok) return response.json();
                else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            })
            .then(responseJSON => {
                tokens = responseJSON;
                localStorage.setItem('refreshToken', tokens.refreshToken);
                confirmLogin();
            })
            .catch(error => {
                console.log('error', error);
            });
    }
}


//logout
function logout() {
    setTimeout(function () {
        document.getElementById('cameraWrapper').setAttribute('position', {x: 0, y: 1.6, z: 0});
        document.getElementById("cameraWrapper").setAttribute('rotation', '0 0 0');
        window.location.hash = "login";
        localStorage.removeItem('refreshToken');
        setTimeout(function () {
            document.getElementById('hidden').setAttribute('visible', true)
        }, 100);
    }, 100);
}

//navgacia
goLogin = function () {
    field = '#username';
    window.location.hash = '#login';
    setTimeout(function () {
        document.getElementById('hidden').setAttribute('visible', true)
    }, 100);
}
