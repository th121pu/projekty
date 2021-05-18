//zmena html po stlaceni tlacidiel - AR/VR
document.querySelector('a-scene').addEventListener('loaded', function () {
    let ar = document.querySelector(".a-enter-ar");
    if (window.location.href.indexOf("indexAR") == -1) {
        setInterval(function () {
            ar.classList.remove('a-hidden');
        }, 1000);
    }

    let arButton = document.querySelector(".a-enter-ar-button");
    arButton.onclick = function () {
        location.replace("./indexAR.html");
    };

    let vrButton = document.querySelector(".a-enter-vr-button");
    vrButton.onclick = function () {
        if (window.location.href.indexOf("indexAR") != -1)
            location.replace("./index.html");
    };
});

//otvorenie formulara
openForm = function (id) {
    let form = document.getElementById(id + "Form");
    if (form.getAttribute('visible') === false) {
        form.setAttribute('visible', true);

        let formPos = document.getElementById(id + "Form" + "Position");
        form.setAttribute('position', formPos.getAttribute('position'));
        form.setAttribute('rotation', formPos.getAttribute('rotation'));

        let children = Array.from(form.childNodes);
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add('clickable');
        }
    }
}

//zatvorenie formulara
closeForm = function (id) {
    if (window.location.href.indexOf("indexAR") == -1) {
        let form = document.getElementById(id + "Form");
        let value = form.getAttribute('visible');
        form.setAttribute('visible', !value);
        let children = Array.from(form.childNodes);

        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('clickable')
        }

        let keyboard = document.getElementById(idToRemove);
        if (keyboard) {
            let label = document.getElementById(idToRemove + "Label");
            keyboard.removeAttribute('a-keyboard');
            keyboard.setAttribute("visible", "false");
            label.setAttribute("visible", "false");
            document.getElementById(field).setAttribute('value', input);
            document.getElementById(field).setAttribute("border-color", "silver");
        }
    } else {
        document.getElementById(id + "Form").remove();
        startCamera();
    }
}

//zobrazenie/ukazanie hesla
function showHidePassword(element) {
    let icon = element.getAttribute('icon');

    let newEl = document.createElement('a-gui-icon-button');
    newEl.setAttribute('height', element.getAttribute('height'));
    newEl.setAttribute('onclick', element.getAttribute('onclick'));
    newEl.setAttribute('background-color', element.getAttribute('background-color'));
    newEl.setAttribute('hover-color', element.getAttribute('hover-color'));
    newEl.setAttribute('icon-font-size', element.getAttribute('icon-font-size'));
    newEl.setAttribute('position', element.getAttribute('position'));
    newEl.setAttribute('active-color', '#0E53A7');
    newEl.classList.add('clickable');

    let id = element.parentElement.id;
    let variableName;
    if (id === 'password') variableName = 'inputPass';
    else variableName = id;

    if (icon === 'eye') {
        newEl.setAttribute('icon', 'eye-disabled');

        if (eval(variableName).length > 0) {
            let variableValue = eval(variableName);
            document.getElementById(id).setAttribute('value', variableValue);
        }
        element.parentNode.replaceChild(newEl, element);

    } else {
        newEl.setAttribute('icon', 'eye');
        element.parentNode.replaceChild(newEl, element);
        if (eval(variableName).length > 0) {
            let variableValue = eval(variableName);
            document.getElementById(id).setAttribute('value', "•".repeat(variableValue.length) + '_');
        }
    }
}

//alert message
function alertMessage(message, type, target) {
    let el = document.createElement('a-alert');
    if (document.getElementById('alert' + message)) document.getElementById('alert' + message).remove();
    el.setAttribute('id', 'alert' + message);
    el.setAttribute('value', message);
    el.setAttribute('type', type);

    document.getElementById(target).appendChild(el);

    setTimeout(function () {
        document.getElementById('alert' + message).setAttribute('position', `${0} ${0} ${0.4}`);
    }, 1);

}

//modal message
function modalMessage(message, type, target) {
    let el = document.createElement('a-modal');
    if (document.getElementById('modal' + message)) document.getElementById('modal' + message).remove();
    el.setAttribute('id', 'modal' + message);

    if (message) el.setAttribute('value', message);
    if (type) el.setAttribute('type', type);

    if (target) {
        document.getElementById(target).appendChild(el);
        setTimeout(function () {
            document.getElementById('modal' + message).setAttribute('position', `${0} ${0} ${0.4}`);
        }, 1);

    } else {
        document.getElementById('router-view').appendChild(el);
        let pos = getCameraWorldPosition();
        let rot = getCameraWorldRotation();
        rot.z = 0;
        rot.x = 0;
        setTimeout(function () {
            document.getElementById('modal' + message).setAttribute('position', pos);
            document.getElementById('modal' + message).setAttribute('rotation', rot);
        }, 1);

    }

}

//close alert or modal
closeAlert = function (id) {
    document.getElementById(id).remove();
}


