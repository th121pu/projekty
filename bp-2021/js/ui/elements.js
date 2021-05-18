//vlastne elementy

//input
AFRAME.registerComponent('input', {
    init: function () {
        let newID = this.el.id;
        let input = document.createElement('a-gui-input');
        input.id = newID;
        input.setAttribute('value', this.el.value);
        input.setAttribute('width', this.el.styleInfo.sizeX);
        input.setAttribute('height', this.el.styleInfo.sizeY);
        let functionName = "changeInput(" + "'" + newID + "'," + "'" + this.el.applianceName + "'" + ")";
        input.setAttribute('onclick', functionName);
        let activeColor = Object.values(this.el.styleInfo)[5];
        let backColor = Object.values(this.el.styleInfo)[4];
        input.setAttribute("font-color", activeColor);
        input.setAttribute("border-hover-color", activeColor);
        input.setAttribute("background-color", backColor);
        input.setAttribute("hover-color", backColor);
        input.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        input.setAttribute("border-color", "silver");
        this.el.replaceWith(input);
    }
});

AFRAME.registerPrimitive('a-input', {
    defaultComponents: {
        input: {},
    },
    mappings: {
        name: 'input.schemaAttribute',
    }
});

//button
AFRAME.registerComponent('button', {
    init: function () {
        let newID = this.el.id;
        let button = document.createElement('a-gui-button');
        button.id = newID;

        //simulovane spravanie
        let functionName;
        if (this.el.name === 'stopTimer' || this.el.name === 'startTimer' || this.el.name === 'stopWasher' ||
            this.el.name === 'startWasher' || this.el.name === 'playSound' || this.el.name === 'pauseSound')
            functionName = this.el.name + "(" + "'" + newID + "'" + ")";
        else functionName = 'postElementPress' + "(" + "'" + newID + "'" + ")";


        button.setAttribute('onclick', functionName);
        button.setAttribute('width', this.el.styleInfo.sizeX);
        button.setAttribute('height', this.el.styleInfo.sizeY);
        button.setAttribute('value', this.el.value);
        button.setAttribute("font-color", Object.values(this.el.styleInfo)[5]);
        button.setAttribute("background-color", Object.values(this.el.styleInfo)[4]);
        button.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        if (this.el.controlName === 'TV control')
            button.setAttribute('adjust', true);
        this.el.replaceWith(button);
    }
});

AFRAME.registerPrimitive('a-button', {
    defaultComponents: {
        button: {},
    },
    mappings: {
        name: 'button.schemaAttribute',
    }
});


//plus
AFRAME.registerComponent('plus', {
    init: function () {
        let newID = this.el.id;
        let plus = document.createElement('a-gui-button');
        plus.id = newID;
        plus.setAttribute('value', this.el.value);
        plus.setAttribute('simadjust', true);
        plus.setAttribute('width', this.el.styleInfo.sizeX);
        plus.setAttribute('height', this.el.styleInfo.sizeY);
        let functionName = "changeTemp(1," + "'" + newID + "'" + ")";
        plus.setAttribute('onclick', functionName);
        plus.setAttribute("font-color", Object.values(this.el.styleInfo)[5]);
        plus.setAttribute("background-color", Object.values(this.el.styleInfo)[4]);
        plus.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        this.el.replaceWith(plus);
    }
});

AFRAME.registerPrimitive('a-plus', {
    defaultComponents: {
        plus: {},
    },
    mappings: {
        name: 'plus.schemaAttribute',
    }
});


//minus
AFRAME.registerComponent('minus', {
    init: function () {
        let newID = this.el.id;
        let minus = document.createElement('a-gui-button');
        minus.id = newID;
        minus.setAttribute('value', this.el.value);
        minus.setAttribute('simadjust', true);
        minus.setAttribute('width', this.el.styleInfo.sizeX);
        minus.setAttribute('height', this.el.styleInfo.sizeY);
        let functionName = "changeTemp(-1," + "'" + newID + "'" + ")";
        minus.setAttribute('onclick', functionName);
        minus.setAttribute("font-color", Object.values(this.el.styleInfo)[5]);
        minus.setAttribute("background-color", Object.values(this.el.styleInfo)[4]);
        minus.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        this.el.replaceWith(minus);
    }
});

AFRAME.registerPrimitive('a-minus', {
    defaultComponents: {
        minus: {},
    },
    mappings: {
        name: 'minus.schemaAttribute',
    }
});

//toggle
AFRAME.registerComponent('toggle', {
    init: function () {
        let newID = this.el.id;
        let toggle = document.createElement('a-gui-toggle');
        toggle.id = newID;
        let functionName = "postElementPress(" + "'" + newID + "'" + ")";
        toggle.setAttribute('onclick', functionName);
        toggle.setAttribute('checked', this.el.value);
        toggle.setAttribute('width', this.el.styleInfo.sizeX);
        toggle.setAttribute('height', this.el.styleInfo.sizeY);
        toggle.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);
        toggle.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        this.el.replaceWith(toggle);
    }
});

AFRAME.registerPrimitive('a-toggle', {
    defaultComponents: {
        toggle: {},
    },
    mappings: {
        name: 'toggle.schemaAttribute',
    }
});

//radiobutton
AFRAME.registerComponent('radio', {
    init: function () {
        let newID = this.el.id;
        let radio = document.createElement('a-gui-radio');
        radio.id = newID;

        let functionName = "postElementPress(" + "'" + newID + "'" + ")";
        radio.setAttribute('onclick', functionName);
        radio.setAttribute('width', this.el.styleInfo.sizeX);
        radio.setAttribute('height', this.el.styleInfo.sizeY);
        radio.setAttribute('checked', this.el.value);
        radio.setAttribute('value', this.el.name);
        radio.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);
        radio.setAttribute('font-color', Object.values(this.el.styleInfo)[5]);
        radio.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});

        this.el.replaceWith(radio);
    }
});

AFRAME.registerPrimitive('a-radio', {
    defaultComponents: {
        radio: {},
    },
    mappings: {
        name: 'radio.schemaAttribute',
    }
});

//checkbutton
AFRAME.registerComponent('checkbox', {
    init: function () {
        let newID = this.el.id;
        let check = document.createElement('a-gui-radio');
        check.id = newID;

        let functionName = "postElementPress(" + "'" + newID + "'" + ")";
        check.setAttribute('onclick', functionName);
        check.setAttribute('ischeck', true);
        check.setAttribute('width', this.el.styleInfo.sizeX);
        check.setAttribute('height', this.el.styleInfo.sizeY);
        check.setAttribute('checked', this.el.value);
        check.setAttribute('value', this.el.name);
        check.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);
        check.setAttribute('font-color', Object.values(this.el.styleInfo)[5]);
        check.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});

        this.el.replaceWith(check);
    }
});

AFRAME.registerPrimitive('a-checkbox', {
    defaultComponents: {
        checkbox: {},
    },
    mappings: {
        name: 'checkbox.schemaAttribute',
    }
});

//slider
AFRAME.registerComponent('slider', {
    init: function () {
        let newID = this.el.id;
        let slider = document.createElement('a-gui-slider');
        slider.id = newID;

        slider.setAttribute('width', this.el.styleInfo.sizeX);
        slider.setAttribute('height', this.el.styleInfo.sizeY);
        let functionName = newID;
        slider.setAttribute('onclick', functionName);
        slider.setAttribute('active-color', Object.values(this.el.styleInfo)[5]);
        slider.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);

        this.el.value = parseInt(this.el.value) / 100;
        slider.setAttribute('percent', this.el.value.toString());
        slider.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});

        this.el.replaceWith(slider);
    }
});


AFRAME.registerPrimitive('a-slider', {
    defaultComponents: {
        slider: {},
    },
    mappings: {
        name: 'slider.schemaAttribute',
    }
});

//label
AFRAME.registerComponent('label', {
    init: function () {
        let newID = this.el.id;
        let label = document.createElement('a-gui-label');
        label.id = newID;

        label.setAttribute('width', this.el.styleInfo.sizeX);
        label.setAttribute('height', this.el.styleInfo.sizeY);
        label.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        label.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);
        label.setAttribute('font-color', Object.values(this.el.styleInfo)[5]);

        if (this.el.value === "TIME") {
            setInterval(function () {
                let d = new Date();
                let minutes = d.getMinutes();
                minutes = minutes < 10 ? '0' + minutes : minutes;
                label.setAttribute('value', d.getHours() + ":" + minutes);
            }, 1000);
        } else label.setAttribute('value', this.el.value);
        this.el.replaceWith(label);


    }
});

AFRAME.registerPrimitive('a-label', {
    defaultComponents: {
        label: {},
    },
    mappings: {
        name: 'label.schemaAttribute',
    }
});

//timer
AFRAME.registerComponent('timer', {
    init: function () {
        let newID = this.el.id;
        let timer = document.createElement('a-gui-circle-timer');
        timer.id = newID;

        let functionName = "changeInput(" + "'" + newID + "'," + "'" + this.el.applianceName + "'," + "'" + 'timer' + "'" + ")";
        timer.setAttribute('onclick', functionName);
        timer.setAttribute('width', this.el.styleInfo.sizeX);
        timer.setAttribute('height', this.el.styleInfo.sizeY);
        timer.setAttribute('position', {x: this.el.styleInfo.positionX, y: this.el.styleInfo.positionY, z: 0});
        timer.setAttribute('background-color', Object.values(this.el.styleInfo)[4]);
        timer.setAttribute('active-color', Object.values(this.el.styleInfo)[5]);
        timer.setAttribute('value', this.el.value);
        this.el.replaceWith(timer);

    }
});

AFRAME.registerPrimitive('a-timer', {
    defaultComponents: {
        timer: {},
    },
    mappings: {
        name: 'timer.schemaAttribute',
    }
});


//alert
AFRAME.registerComponent('alert', {
    schema: {
        value: {type: 'string', default: 'Alert info'},
        type: {type: 'string', default: 'info'},
    },
    init: function () {
        let color = '#0E53A7';
        if (this.data.type === 'error') color = '#DC143C';
        let alert = document.createElement('a-gui-label');
        alert.id = this.el.id;
        alert.setAttribute('width', '1.4');
        alert.setAttribute('font-size', '60px');
        alert.setAttribute('height', '0.75');
        alert.setAttribute('background-color', 'white');
        alert.setAttribute('font-color', 'black');
        alert.setAttribute('value', this.data.value);

        addBorders(alert, color);

        let button = document.createElement('a-gui-button');
        button.setAttribute('value', 'OK');
        button.setAttribute('width', '0.3');
        button.setAttribute('height', '0.2');
        button.setAttribute('font-size', '60px');
        button.setAttribute('position', '0 -0.22 0');
        button.setAttribute('background-color', color);
        button.setAttribute('font-color', 'white');
        button.setAttribute('onclick', "closeAlert(" + "'" + alert.id + "'" + ")");
        if (this.data.type === 'error') button.setAttribute('hover-color', '#FF4040');
        button.classList.add('clickable');
        alert.appendChild(button);

        let title = document.createElement('a-troika-text');
        title.setAttribute('position', '0 0.22 0.001');
        title.setAttribute('color', color);
        title.setAttribute('align', 'center');
        title.setAttribute('font-size', '0.15');
        if (this.data.type === 'error') title.setAttribute('value', 'Chyba');
        else title.setAttribute('value', 'Info');

        alert.appendChild(title);

        this.el.replaceWith(alert);
    }
});

AFRAME.registerPrimitive('a-alert', {
    defaultComponents: {
        'alert': {},
    },
    mappings: {
        'value': 'alert.value',
        'type': 'alert.type'
    }
});


//modal
AFRAME.registerComponent('modal', {
    schema: {
        value: {type: 'string', default: 'Odhlásiť sa?'},
        type: {type: 'string', default: 'logout()'},
    },
    init: function () {
        let color = '#0E53A7';
        let modal = document.createElement('a-gui-label');
        modal.id = this.el.id;
        modal.setAttribute('width', '1.4');
        modal.setAttribute('font-size', '55px');
        modal.setAttribute('height', '0.75');
        modal.setAttribute('background-color', 'white');
        modal.setAttribute('font-color', 'black');
        modal.setAttribute('value', this.data.value);

        addBorders(modal, color);

        let button = document.createElement('a-gui-button');
        button.setAttribute('value', 'NIE');
        button.setAttribute('width', '0.35');
        button.setAttribute('height', '0.2');
        button.setAttribute('font-size', '60px');
        button.setAttribute('position', '-0.25 -0.22 -0.0');
        button.setAttribute('background-color', 'white');
        button.setAttribute('font-color', color);
        button.setAttribute('onclick', "closeAlert(" + "'" + modal.id + "'" + ")");
        button.classList.add('clickable');
        modal.appendChild(button);

        let button2 = document.createElement('a-gui-button');
        button2.setAttribute('value', 'ÁNO');
        button2.setAttribute('width', '0.35');
        button2.setAttribute('height', '0.2');
        button2.setAttribute('font-size', '60px');
        button2.setAttribute('position', '0.25 -0.22 -0.01');
        button2.setAttribute('background-color', color);
        button2.setAttribute('font-color', 'white');
        button2.setAttribute('onclick', this.data.type);
        button2.classList.add('clickable');
        modal.appendChild(button2);

        let title = document.createElement('a-troika-text');
        title.setAttribute('position', '0 0.22 0.001');
        title.setAttribute('color', color);
        title.setAttribute('align', 'center');
        title.setAttribute('font-size', '0.15');
        title.setAttribute('value', 'Dialog');

        modal.appendChild(title);

        this.el.replaceWith(modal);
    }
});

AFRAME.registerPrimitive('a-modal', {
    defaultComponents: {
        'modal': {},
    },
    mappings: {
        'value': 'modal.value',
        'type': 'modal.type'
    }
});

