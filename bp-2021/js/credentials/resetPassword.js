//tlacidlo zabudnutu heslo zo stranky prihlasenia
function buttonReset () {
    window.location.hash = "reset";
    field = 'resetEmail';
}

//klavesnica pre obnovu hesla
let resetEmail = '';

function updateReset(e) {
    document.getElementById(field).setAttribute("font-color", "black");
    document.getElementById(field).setAttribute("border-color", "#0E53A7");
    let code = parseInt(e.detail.code);
    switch (code) {
        case 8:
            resetEmail = resetEmail.slice(0, -1);
            break;
        case 24:
            resetEmail = '';
            break;
        case 6:
            completeReset();
            break;
        default:
            resetEmail = resetEmail + e.detail.value;
            break;
    }
    document.getElementById(field).setAttribute('value', resetEmail + '_');
}

//stlacenie obnovy hesla poziadavka na server
function completeReset() {
    const validateEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (validateEmail.test(String(resetEmail).toLowerCase()) !== true) {
        resetEmail = '';
        document.getElementById('resetEmail').setAttribute('value', "Wrong format!");
        document.getElementById('resetEmail').setAttribute('font-color', "#DC143C");
    } else {

        fetch("https://bp-smart-env-api.herokuapp.com/auth/login/reset-password?email=tomas.halgas1%40gmail.com")
            .then(response => {
                if (response.ok) return response.json();
                else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            })
            .then(responseJSON => {
                console.log(responseJSON);
            })
            .catch(error => {
                alertMessage('Zmena neúspešná', 'error', 'resetForm');
                console.log('error', error)
            });
    }
}