function changeMode(mode) {
    Array.from(document.getElementsByClassName('main')).forEach(e => {
        e.classList.add('hidden');
    });
    document.querySelector('.' + mode).classList.remove('hidden');

    switch (mode) {
        case 'ausschank':
            updateAusschank();
            break;
    
        default:
            break;
    }
}

function selectNavItem(item) {
    Array.from(document.querySelectorAll('.mode')).forEach(e => {
        e.classList.remove('selected');
    });
    item.classList.add('selected');
}

function generateAusschank() {
    let page = document.getElementById('ausschank');
    let temp = createColorSlider('Temperatur', '#f8f6e1', '#fddb6a', 180, (window.innerHeight * 0.9));
    let dim = createFader('Dimmer', 0, 255, 180, (window.innerHeight * 0.9));
    page.appendChild(temp);
    page.appendChild(dim);
    temp.setValue(.25);
    dim.setValue(100);

    let buttons = document.createElement('div');
    buttons.classList.add("container");
    buttons.style.setProperty('--width', '100%');
    buttons.style.setProperty('--height', (window.innerHeight * 0.95) + 'px');

    let presets = createButtonSection('Presets', (window.innerWidth * 0.7), (window.innerHeight * 0.45));
    presets.addButton('Aus', 'power_settings_new')
    presets.addButton('Tag', 'sunny');
    presets.addButton('Abend', 'blinds');
    presets.addButton('Nacht', 'bedtime');
    presets.addButton('Dynamisch', 'flare');
    presets.addButton('Schließen', 'lock');
    buttons.appendChild(presets);

    let effects = createButtonSection('Effekte', (window.innerWidth * 0.7), (window.innerHeight * 0.45));
    effects.addButton('Schnapspause', 'notifications');
    effects.addButton('Quizz', 'quiz');
    effects.addButton('Letzte Runde', 'sports_bar');
    buttons.appendChild(effects);
    page.appendChild(buttons);
}

function generateSumpf() {
    let page = document.getElementById('contentSumpf');
    let dim = createFader('Dimmer', 0, 255, 180, (window.innerHeight * 0.9));
    page.appendChild(dim);
    dim.setValue(128);
}

function generateExpert() {

}

function generateSettings() {

}

function updateAusschank() {
}

window.onload = (e) => {
    generateAusschank();
    generateSumpf();
    generateExpert();
    generateSettings();

    changeMode('ausschank');
    selectNavItem(document.getElementById('ausschankNavItem'));
}


// Settings scripts
function changeSettingsPage(name) {
    Array.from(document.getElementById('settingsNav').children).forEach(e => {
        e.classList.remove('selected');
    });
    Array.from(document.getElementById('settingsContent').children).forEach(e => {
        e.classList.add('hidden');
    });

    switch (name) {
        case 'mapping':
            document.getElementById('settingsNavItemMapping').classList.add("selected");
            document.getElementById('settingsMappingContent').classList.remove("hidden");
            break;
        case 'effects':
            document.getElementById('settingsNavItemEffects').classList.add("selected");
            document.getElementById('settingsEffectsContent').classList.remove("hidden");
            break;
        case 'segments':
            document.getElementById('settingsNavItemSegments').classList.add("selected");
            document.getElementById('settingsSegmentsContent').classList.remove("hidden");
            break;
        case 'lock':
            document.getElementById('settingNavItemLock').classList.add("selected");
            document.getElementById('settingsLockContent').classList.remove("hidden");
            break;
        
        default:
            break;
    }
}