//incializacia skenovania QR kodu
QrScanner.WORKER_PATH = 'js/dist/qr-scanner-worker.min.js';
const qrScanner = new QrScanner(document.getElementById('preview'), result => readResult(result));
startCamera();

function startCamera() {
    qrScanner.start();
}

//reakcia na najdenie QR kodu
function readResult(result) {
    qrScanner.stop();
    generateFormForAr(result);
}

//parovanie/ziskanie obsahu zariadenia podla naskenovaneho serial number
function generateFormForAr(scannedCode) {
    let headers = new Headers();
    headers.append("Authorization", `Bearer ${tokens.accessToken}`);

    let postOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/appliance/pair/${scannedCode}`, postOptions)
        .then(response => {
            if (response.ok) return response.json();
            else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .then(responseJSON => {
            console.log('PAIRED');
        })
        .catch(error => {
            console.log('error', error);
        });

    let requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    fetch(`https://bp-smart-env-api.herokuapp.com/home/appliance/code/${scannedCode}`, requestOptions)
        .then(response => {
            if (response.ok) return response.json();
            else return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
        })
        .then(responseJSON => {
            let appliance = responseJSON;
            jsonToForm(appliance);
        })
        .catch(error => {
            console.log('error', error);
        });

}


