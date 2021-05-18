//minus/plus change
function run(name, buttonId) {
    name = name.split('(')[1];
    let id = name.split("'")[1];
    let event = new CustomEvent('animation');
    if (document.getElementById(buttonId)) document.getElementById(buttonId).dispatchEvent(event);
    postElementPress(id);
}

//timer microwave
startTimer = function (id) {
    let timerId = id.split('++')[1] + "++" + id.split('++')[2];
    let countDownEntity = document.getElementById(timerId);
    let seconds = countDownEntity.getAttribute('value');
    let interval;
    if (seconds > 0) {
        interval = setInterval(function () {
            seconds = parseInt(seconds);
            seconds = seconds - 1;
            countDownEntity.setAttribute('value', seconds);
            if (seconds <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    let el = document.getElementById(timerId);
    el.addEventListener('stop', function (evt) {
        clearInterval(interval);
    });

    postElementPress(id);
}

stopTimer = function (id) {
    let timerId = id.split('++')[1] + "++" + id.split('++')[2];
    let event = new CustomEvent('stop');
    document.getElementById(timerId).dispatchEvent(event);
    postElementPress(id);

}

function resetStartingTime(field, post) {
    let event = new CustomEvent("reset");
    document.getElementById(field).dispatchEvent(event);
    if (post) postElementPress(field, document.getElementById(field).getAttribute('value'));
}

//timer washer
startWasher = function (id) {
    let timerId = id.split('++')[1] + "++" + id.split('++')[2];
    let countDownEntity = document.getElementById(timerId);
    let minutes = countDownEntity.getAttribute('value');
    minutes = minutes.match(/\d/g).join("");
    let interval;
    if (minutes > 0) {
        interval = setInterval(function () {
            minutes = minutes - 1;
            countDownEntity.setAttribute('value', "Zostáva: " + minutes + "min");
            if (minutes <= 0) {
                clearInterval(interval);
            }
        }, 6000);
    }

    let el = document.getElementById(timerId);
    el.addEventListener('stop', function (evt) {
        clearInterval(interval);
    });

    postElementPress(id);
}

stopWasher = function (id) {
    let timerId = id.split('++')[1] + "++" + id.split('++')[2];
    let event = new CustomEvent('stop');
    document.getElementById(timerId).dispatchEvent(event);
    postElementPress(id);

}

//interacion for sound
function pauseSound(id) {
    postElementPress(id);
    soundEntity.components.sound.pauseSound();
}

function playSound(id) {
    postElementPress(id);
    soundEntity.components.sound.playSound();
}

