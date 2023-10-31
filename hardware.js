async function getSegments() {
    const response = await fetch("getSegments.json");
    const segments = await response.json();
    return segments;
}

function getSegment(id) {

}

function createSegment() {
    
}