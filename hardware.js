function getSegmentTypes() {
    return ['MQTT', 'SSDLED', 'WLED', 'Zigbee'];
}

async function getSegments() {
    const response = await fetch("getSegments.json");
    const segments = await response.json();
    return segments;
}

async function getSegment(id) {
    let response = await fetch("getSegment.json", {
        Method: 'POST', 
        Headers: {Accept: 'application.json', 'Content-Type':'application/json'},
        Body: id,
        Cache: 'default'
    });
    return await response.json();
}

function createSegment() {
    
}