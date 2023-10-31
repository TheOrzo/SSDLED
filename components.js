function createFader(name, style, min, max, color1, color2) {
    let faderbody = document.createElement('div');
    faderbody.classList.add("faderbody");
    faderbody.style.setProperty('--from', min);
    faderbody.style.setProperty('--to', max);
    let fader = document.createElement('div');
    fader.classList.add("fader");

    let scale, head;
    switch (style) {
        case 'color':
            scale = document.createElement('div');
            scale.classList.add("colorscale");
            scale.style.setProperty('--from-color', color1);
            scale.style.setProperty('--to-color', color2);
            head = document.createElement('div');
            head.classList.add("fadecolorhead"); 
            break;
        case 'value':
            scale = document.createElement('div');
            scale.classList.add("fadescale");
            let center = document.createElement('div');
            center.classList.add('center');
            let label = document.createElement('div');
            label.classList.add('label');
            let zero = document.createElement('span');
            zero.textContent = min;
            let half = document.createElement('span');
            half.textContent = Math.round((max - min) / 2);
            let full = document.createElement('span');
            full.textContent = max;
            label.appendChild(zero);
            label.appendChild(half);
            label.appendChild(full);
            scale.appendChild(center);
            scale.appendChild(label);

            head = document.createElement('div');
            head.classList.add("fader", "fadehead");
        break
    }
    
    let faderattr = document.createElement('div');
    faderattr.classList.add("fadeattr");
    faderattr.textContent = name;
    fader.appendChild(scale);
    fader.appendChild(head);
    faderbody.appendChild(fader);
    faderbody.appendChild(faderattr);
    
    faderbody.faderstyle = style;
    faderbody.isDragging = false;
    faderbody.color = 0;
    faderbody.value = 0;
    faderbody.min = min;
    faderbody.max = max;

    faderbody.isVertical = function() {return faderbody.clientWidth <= faderbody.clientHeight;};

    faderbody.updateV = function(pos) {
        let faderHeight = scale.clientHeight;
        if(pos > faderHeight) {
            pos = faderHeight;
        } else if (pos < 0) {
            pos = 0;
        }
        head.style.marginTop = (pos - head.clientHeight / 2 - getComputedStyle(head).borderTopWidth.slice(0, -2)) + 'px';
        head.style.marginLeft = 'unset';
        
        if (style == 'color') {
            faderbody.color = linearGradient(scale.style.getPropertyValue('--from-color'), scale.style.getPropertyValue('--to-color'), (faderHeight - pos)/faderHeight);
            head.style.backgroundColor = faderbody.color;
        }
        
        faderbody.value = (faderHeight - pos) / faderHeight * (max - min);
    };
    
    faderbody.updateH = function(pos) {
        let faderWidth = scale.clientWidth;
        if(pos > faderWidth) {
            pos = faderWidth;
        } else if (pos < 0) {
            pos = 0;
        }
        head.style.marginLeft = (pos - head.clientWidth / 2 - getComputedStyle(head).borderLeftWidth.slice(0, -2)) + 'px'; // 5px border width
        head.style.marginTop = 'unset';
                
        if (style == 'color') {
            faderbody.color = linearGradient(scale.style.getPropertyValue('--from-color'), scale.style.getPropertyValue('--to-color'), (faderWidth - pos)/faderWidth);
            head.style.backgroundColor = faderbody.color;
        }
        faderbody.value = (faderWidth - pos) / faderWidth * (max - min);
    };

    faderbody.setValue = function(v) {
        if (v > faderbody.max) {v = max;}
        if (v < min) {v = min;}

        if (faderbody.isVertical()) {
            let faderHeight = scale.clientHeight;
            let faderOffset = scale.offsetTop; // will be substracted in update()
            let pos = faderHeight - (v / (max - min)) * faderHeight;
            
            faderbody.updateV(pos);
            faderbody.value = v;
        } else {
            let width = scale.clientWidth;
            let offset = scale.offsetLeft; // will be substracted in update()
            let pos = width - (v / (max - min)) * width;
            
            faderbody.updateH(pos);
        }
    };

    scale.addEventListener('mousedown', e => {
        this.isDragging = true;

        if (faderbody.isVertical()) {
            // Fader is vertical
            let faderOffset = scale.offsetTop;
            faderbody.updateV(e.clientY - faderOffset);
        } else {
            // Fader is horizontal
            let faderOffset = scale.offsetLeft;
            faderbody.updateH(e.clientX - faderOffset);
        }
        
    });
    head.addEventListener('mousedown', e => {
        this.isDragging = true;
    });
    scale.addEventListener('touchstart', e => {
        this.isDragging = true;

        if (faderbody.isVertical()) {
            let faderOffset = scale.offsetTop;
            faderbody.updateV(e.clientY - faderOffset);
        } else {
            let faderOffset = scale.offsetLeft;
            faderbody.updateH(e.clientX - faderOffset);
        }
    });
    head.addEventListener('touchstart', e => {
        this.isDragging = true;
    });
    
    faderbody.addEventListener('mouseup', e => {
        this.isDragging = false;
    });
    faderbody.addEventListener('touchend', e => {
        this.isDragging = false;
    });

    faderbody.addEventListener('mouseleave', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mousemove', e => {
        if (this.isDragging) {
            if (faderbody.isVertical()) {
                let faderOffset = scale.offsetTop;
                faderbody.updateV(e.clientY - faderOffset);
            } else {
                let faderOffset = scale.offsetLeft;
                faderbody.updateH(e.clientX - faderOffset);
            }
        }
    });
    fader.addEventListener('touchmove', e => {
        if (this.isDragging) {
            if (faderbody.isVertical()) {
                let faderOffset = scale.offsetTop;
                faderbody.updateV((e.targetTouches[0] ? e.targetTouches[0].pageY : e.changedTouches[e.changedTouches.length-1].pageY) - faderOffset);
            } else {
                let faderOffset = scale.offsetLeft;
                faderbody.updateH((e.targetTouches[0] ? e.targetTouches[0].pageX : e.changedTouches[e.changedTouches.length-1].pageX) - faderOffset);
            }
        }
    });

    fader.addEventListener('contextmenu', e => {
        e.preventDefault();
    }, false);

    return faderbody;
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

function createOldFader(name, style, min, max, width, height) {
    let faderbody = document.createElement('div');
    faderbody.classList.add("faderbody");
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
    faderbody.appendChild(fader);
    faderbody.appendChild(faderattr);
    
    faderbody.isDragging = false;
    faderbody.value = 0;
    faderbody.min = min;
    faderbody.max = max;

    faderbody.updateV = function(value) {
        let faderHeight = faderscale.clientHeight;
        if(value > faderHeight) {
            value = faderHeight;
        } else if (value < 0) {
            value = 0;
        }
        let head = fader.querySelector('.fadehead');
        head.style.marginTop = (value - head.clientHeight / 2) + 'px';

        faderbody.value = faderHeight - value;
    };

    faderscale.addEventListener('mousedown', e => {
        this.isDragging = true;
        faderbody.updateV(e.clientY - faderscale.offsetTop);
    });
    faderhead.addEventListener('mousedown', e => {
        this.isDragging = true;
    });
    faderscale.addEventListener('touchstart', e => {
        e.preventDefault();
        this.isDragging = true;

        let faderOffset = faderscale.offsetTop;
        faderbody.updateV(e.clientY - faderOffset);
    });
    faderhead.addEventListener('touchstart', e => {
        e.preventDefault();
        this.isDragging = true;
    });
    
    fader.addEventListener('mouseup', e => {
        this.isDragging = false;
    });
    fader.addEventListener('touchend', e => {
        e.preventDefault();
        this.isDragging = false;
    });

    fader.addEventListener('mouseleave', e => {
        this.isDragging = false;
    });

    fader.addEventListener('mousemove', e => {
        if (this.isDragging) {
            faderbody.updateV(e.clientY - faderscale.offsetTop);
        }
    });
    fader.addEventListener('touchmove', e => {
        e.preventDefault();
        if (this.isDragging) {
            let faderOffset = faderscale.offsetTop;
            faderbody.updateV((e.targetTouches[0] ? e.targetTouches[0].pageY : e.changedTouches[e.changedTouches.length-1].pageY) - faderOffset);
        }
    }, false);

    faderbody.setValue = function(v) {
        if (v > max) {v = max;}
        if (v < min) {v = min;}

        let faderHeight = faderscale.clientHeight;
        let faderOffset = faderscale.offsetTop;
        let pos = faderHeight - v / (max - min) * faderHeight;
        
        faderhead.style.marginTop = (pos - faderhead.clientHeight / 2) + 'px';
        faderhead.style.backgroundColor = faderbody.color;
        faderbody.value = v;
    };

    fader.addEventListener('contextmenu', e => {
        e.preventDefault();
    }, false);

    return faderbody;
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

function createSegmentInfo(info) {
    let container = document.createElement('div');
    container.classList.add('segment');
    let icon = document.createElement('img');
    switch (info.type) {
        case "WLED":
            icon.setAttribute("src", "wled.png")
            break;
        default:
            break;
    }
    let name = document.createElement('span');
    name.textContent = info.name;
    let state = document.createElement('span');
    state.classList.add('material-icons');
    state.innerText = 'brightness_1';
    switch (info.state) {
        case 0:
            state.style.color = 'red';
            break;
        case 1:
            state.style.color = 'orange';
            break;
        case 2:
            state.style.color = 'green';
            break;
    }
    container.appendChild(icon);
    container.appendChild(name);
    container.appendChild(state);
    container.addEventListener('click', e => {loadSegmentProperties(info.id)});
    return container;
}