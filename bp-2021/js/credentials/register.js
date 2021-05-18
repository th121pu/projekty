//tlacidlo registrovat sa zo stranky prihlasenia
function buttonRegister () {
    window.location.hash = "register";
    field = 'regFirstname';
}

//klavesnica pre registraciu
let regFirstname = '';
let regLastname = '';
let regUsername = '';
let regEmail = '';
let regPass = '';
let regPass2 = '';

function updateRegister(e) {
    document.getElementById(field).setAttribute("font-color", "black");
    document.getElementById(field).setAttribute("border-color", "#0E53A7");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            if (field === 'regFirstname')
                regFirstname = regFirstname.slice(0, -1);
            else if (field === 'regLastname')
                regLastname = regLastname.slice(0, -1);
            else if (field === 'regUsername')
                regUsername = regUsername.slice(0, -1);
            else if (field === 'regEmail')
                regEmail = regEmail.slice(0, -1);
            else if (field === 'regPass')
                regPass = regPass.slice(0, -1);
            else if (field === 'regPass2')
                regPass2 = regPass2.slice(0, -1);

            break;
        case 24:
            eval(field + '= ""');
            break;
        case 6:
            completeReg();
            break;
        default:
            if (field === 'regFirstname')
                regFirstname = regFirstname + e.detail.value;
            else if (field === 'regLastname')
                regLastname = regLastname + e.detail.value;
            else if (field === 'regUsername')
                regUsername = regUsername + e.detail.value;
            else if (field === 'regEmail')
                regEmail = regEmail + e.detail.value;
            else if (field === 'regPass')
                regPass = regPass + e.detail.value;
            else if (field === 'regPass2')
                regPass2 = regPass2 + e.detail.value;
            break;
    }
    if (field === 'regFirstname')
        document.getElementById(field).setAttribute('value', regFirstname + '_');
    else if (field === 'regLastname')
        document.getElementById(field).setAttribute('value', regLastname + '_');
    else if (field === 'regUsername')
        document.getElementById(field).setAttribute('value', regUsername + '_');
    else if (field === 'regEmail')
        document.getElementById(field).setAttribute('value', regEmail + '_');
    else if (field === 'regPass') {
        if (document.getElementById(field).firstElementChild.getAttribute('icon') !== 'eye-disabled')
        document.getElementById(field).setAttribute('value', "•".repeat(regPass.length) + '_');
        else document.getElementById(field).setAttribute('value', regPass + '_');
    }
    else if (field === 'regPass2')
        if (document.getElementById(field).firstElementChild.getAttribute('icon') !== 'eye-disabled')
            document.getElementById(field).setAttribute('value', "•".repeat(regPass2.length) + '_');
        else document.getElementById(field).setAttribute('value', regPass2 + '_');
}


function toReg (name) {
    let elNew = document.getElementById(name);
    secretPass();
    field = name;
    elNew.setAttribute("font-color", "black");
    elNew.setAttribute("border-color", "#0E53A7");
    elNew.classList.remove('clickable');

    if (elNew.firstElementChild.lastElementChild) {
        elNew.firstElementChild.lastElementChild.setAttribute("material", "color: #0E53A7");
    }
}

function secretPass() {
    let elOld;
    elOld = document.getElementById(field);
    if (eval(field) !== "") {
        if ((field === 'regPass' || field === 'regPass2') && document.getElementById(field).firstElementChild.getAttribute('icon') !== 'eye-disabled') {
            elOld.setAttribute("value", "•".repeat(eval(field).length));
        } else elOld.setAttribute("value", eval(field));
    } else {
        elOld.setAttribute("font-color", "silver");
    }

    elOld.setAttribute("border-color", "silver");
    elOld.classList.add('clickable');

    if (elOld.firstElementChild.lastElementChild) {
        elOld.firstElementChild.lastElementChild.setAttribute("material", "color: #d3d3d4");
    }
}

//po stlaceni tlacidla na registraciu
function completeReg() {
    const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regPass !== regPass2 || regLastname === "" || regFirstname === "" || regUsername === "" || regEmail === "" || regPass === "" || regPass2 === "" || validateEmail.test(String(regEmail).toLowerCase()) !== true) {
        if (regPass !== regPass2 || regPass === "" || regPass2 === "") {
            regPass = '';
            regPass2 = '';
            document.getElementById('regPass').setAttribute('value', "Try again!");
            document.getElementById('regPass').setAttribute('font-color', "#DC143C");
            document.getElementById('regPass2').setAttribute('value', "Try again!");
            document.getElementById('regPass2').setAttribute('font-color', "#DC143C");
        }
        if (regFirstname === "") {
            document.getElementById('regFirstname').setAttribute('value', "Fill firstname!");
            document.getElementById('regFirstname').setAttribute('font-color', "#DC143C");
        }

        if (regLastname === "") {
            document.getElementById('regLastname').setAttribute('value', "Fill lastname!");
            document.getElementById('regLastname').setAttribute('font-color', "#DC143C");
        }

        if (regUsername === "") {
            document.getElementById('regUsername').setAttribute('value', "Fill username!");
            document.getElementById('regUsername').setAttribute('font-color', "#DC143C");
        }

        if (regEmail === "") {
            document.getElementById('regEmail').setAttribute('value', "Fill email!");
            document.getElementById('regEmail').setAttribute('font-color', "#DC143C");
        } else if (validateEmail.test(String(regEmail).toLowerCase()) !== true) {
            regEmail = '';
            document.getElementById('regEmail').setAttribute('value', "Wrong format!");
            document.getElementById('regEmail').setAttribute('font-color', "#DC143C");
        }
    } else {
        register();
    }

}

//poziadavka na server
function register() {
    let raw = JSON.stringify({
        "username": regUsername,
        "password": regPass,
        "firstname": regFirstname,
        "lastname": regLastname,
        "mail": regEmail
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bp-smart-env-api.herokuapp.com/auth/login/create-user", requestOptions)
        .then(response => {
            if (response.ok) return response.json();
            else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .then(responseJSON => {
            inputUsername = regUsername;
            inputPass = regPass;
            login();
        })
        .catch(error => {
            console.log('error', error);
            alertMessage('Registrácia neúspešná', 'error', 'regForm');
        });
}