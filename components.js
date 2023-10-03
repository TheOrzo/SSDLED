function createColorSlider(name, from, to, width, height) {
    let fader = document.createElement('div');
    fader.classList.add("colorfader");
    fader.style.setProperty('--width', width + 'px');
    fader.style.setProperty('--height', height + 'px');
    let fadercolor = document.createElement('div');
    fadercolor.classList.add("colorfader", "fadecolor");
    fadercolor.style.setProperty('--from-color', from);
    fadercolor.style.setProperty('--to-color', to);
    let faderhead = document.createElement('div');
    faderhead.classList.add("colorfader", "fadecolorhead");
    let faderattr = document.createElement('div');
    faderattr.classList.add("colorfader", "fadeattr");
    faderattr.textContent = name;
    fader.appendChild(fadercolor);
    fader.appendChild(faderhead);
    fader.appendChild(faderattr);
    
    fader.isDragging = false;
    fader.color = 0;
    fader.value = 0;

    fader.update = function(pos) {
        let faderHeight = fadercolor.clientHeight;
        if(pos > faderHeight) {
            pos = faderHeight;
        } else if (pos < 0) {
            pos = 0;
        }
        faderhead.style.marginTop = (pos - faderhead.clientHeight / 2) + 'px';
        
        fader.color = linearGradient(fadercolor.style.getPropertyValue('--from-color'), fadercolor.style.getPropertyValue('--to-color'), (faderHeight - pos)/faderHeight);
        faderhead.style.backgroundColor = fader.color;
        fader.value = (faderHeight - pos) / faderHeight;
    };

    fadercolor.addEventListener('mousedown', e => {
        this.isDragging = true;

        let faderOffset = fadercolor.offsetTop;
        fader.update(e.clientY - faderOffset);
    });
    faderhead.addEventListener('mousedown', e => {
        this.isDragging = true;
    });
    
    fader.addEventListener('mouseup', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mouseleave', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mousemove', e => {
        if (this.isDragging) {
            let faderOffset = fadercolor.offsetTop;
            fader.update(e.clientY - faderOffset);
        }
    });

    fader.addEventListener('contextmenu', e => {
        e.preventDefault();
    }, false);

    fader.setValue = function(v) {
        if (v > 1) {v = 1;}
        if (v < 0) {v = 0;}

        let faderHeight = fadercolor.clientHeight;
        let faderOffset = fadercolor.offsetTop;
        let pos = faderHeight - v * faderHeight;
        
        faderhead.style.marginTop = (pos - faderhead.clientHeight / 2) + 'px';
        fader.color = linearGradient(fadercolor.style.getPropertyValue('--from-color'), fadercolor.style.getPropertyValue('--to-color'), (faderHeight - pos)/faderHeight);
        faderhead.style.backgroundColor = fader.color;
        fader.value = v;
    };

    return fader;
}

function linearGradient(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color1);
    var rgb2 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2);
    var r = Math.round(parseInt(rgb1[1], 16) * w1 + parseInt(rgb2[1], 16) * w2);
    var g = Math.round(parseInt(rgb1[2], 16) * w1 + parseInt(rgb2[2], 16) * w2);
    var b = Math.round(parseInt(rgb1[3], 16) * w1 + parseInt(rgb2[3], 16) * w2);
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function createFader(name, min, max, width, height) {
    let fader = document.createElement('div');
    fader.classList.add("fader");
    fader.style.setProperty('--width', width + 'px');
    fader.style.setProperty('--height', height + 'px');
    fader.style.setProperty('--from', min);
    fader.style.setProperty('--to', max);
    let faderscale = document.createElement('div');
    faderscale.classList.add("fader", "fadescale");
    faderscale.style.background='url('+ drawFaderScale(min, max, width * 0.8, height * 0.95 - 30, '#FFB74D') +')';
    faderscale.style.backgroundRepeat = 'no-repeat';
    let faderhead = document.createElement('div');
    faderhead.classList.add("fader", "fadehead");
    let faderattr = document.createElement('div');
    faderattr.classList.add("fader", "fadeattr");
    faderattr.textContent = name;
    fader.appendChild(faderscale);
    fader.appendChild(faderhead);
    fader.appendChild(faderattr);
    
    fader.isDragging = false;
    fader.value = 0;
    fader.min = min;
    fader.max = max;

    fader.update = function(value) {
        let faderHeight = faderscale.clientHeight;
        if(value > faderHeight) {
            value = faderHeight;
        } else if (value < 0) {
            value = 0;
        }
        let head = fader.querySelector('.fadehead');
        head.style.marginTop = (value - head.clientHeight / 2) + 'px';

        fader.value = faderHeight - value;
    };

    faderscale.addEventListener('mousedown', e => {
        this.isDragging = true;
        fader.update(e.clientY - faderscale.offsetTop);
    });
    faderhead.addEventListener('mousedown', e => {
        this.isDragging = true;
    });
    
    fader.addEventListener('mouseup', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mouseleave', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mousemove', e => {
        if (this.isDragging) {
            fader.update(e.clientY - faderscale.offsetTop);
        }
    });

    fader.setValue = function(v) {
        if (v > max) {v = max;}
        if (v < min) {v = min;}

        let faderHeight = faderscale.clientHeight;
        let faderOffset = faderscale.offsetTop;
        let pos = faderHeight - v / (max - min) * faderHeight;
        
        faderhead.style.marginTop = (pos - faderhead.clientHeight / 2) + 'px';
        faderhead.style.backgroundColor = fader.color;
        fader.value = v;
    };

    fader.addEventListener('contextmenu', e => {
        e.preventDefault();
    }, false);

    return fader;
}

function drawFaderScale(from, to, width, height, color) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    let ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(width / 2 - 5, 0, 10, height);
    
    ctx.font = "16px Helvetica";
    let metrics = ctx.measureText(to);
    ctx.fillText(to, width/2 - metrics.width - width*0.15, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + 1);
    metrics = ctx.measureText(Math.round((to - from) / 2));
    ctx.fillText(Math.round((to - from) / 2), width/2 - metrics.width - width*0.15, height/2 + metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    metrics = ctx.measureText(from);
    ctx.fillText(from, width/2 - metrics.width - width*0.15, height - 1);

    return canvas.toDataURL();
}

function createButtonSection(name, width, height) {
    let container = document.createElement('div');
    container.classList.add("section");
    container.style.setProperty('--width', width + 'px');
    container.style.setProperty('--height', height + 'px');
    let title = document.createElement('div');
    title.textContent = name;
    let buttons = document.createElement('div');
    buttons.classList.add("buttonsection");

    container.appendChild(title);
    container.appendChild(buttons);

    container.addButton = function (name, icon) {buttons.appendChild(createSimpleButton(name, icon));};

    return container;
}

function createSimpleButton(name, icon) {
    let tc = tinycolor('#313131');
    let button = document.createElement('div');
    button.classList.add('simplebutton');
    button.style.setProperty('--color-disabled', tc.toString());
    button.style.setProperty('--color-hover', tc.lighten(10).toString());
    button.style.setProperty('--color-enabled', tc.toString());
    let img = document.createElement('span');
    img.classList.add('material-icons');
    img.innerHTML = icon;
    let text = document.createElement('span');
    text.textContent = name;
    button.appendChild(img);
    button.appendChild(text);

    button.addEventListener('click', e => {
        if (button.classList.contains('selected')) {button.classList.remove('selected');}
        else {button.classList.add('selected');}
    });

    return button;
}