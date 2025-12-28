let speakersContainer = document.getElementById("speakers_container");
let workshopsContainer = document.getElementById("workshops_container");

function createContainer(object, isSpeaker) {
    let container = document.createElement("div");
    container.className = isSpeaker ? "speaker_container" : "workshop_container";

        let img = document.createElement("img");
        img.src = object.imgSrc;
        img.alt = isSpeaker ? `Portrait of ${object.name}` : object.name;
        container.appendChild(img);

        let descriptionContainer = document.createElement("div");
        descriptionContainer.className = "description_container";

            let nameP = document.createElement("p");
            nameP.className = "name";
            nameP.appendChild(document.createTextNode(object.name));
            descriptionContainer.appendChild(nameP);

            object.descriptionArray.forEach(descLine => {
                let p = document.createElement("p");
                p.appendChild(document.createTextNode(descLine));
                descriptionContainer.appendChild(p);
            });

        container.appendChild(descriptionContainer);

    return container;
}

function createSpeakerContainer(speaker) {
    return createContainer(speaker, true);
}

function createWorkshopContainer(workshop) {
    return createContainer(workshop, false);
}

function generateSpeakersContainers(speakersObjects) {
    // Remove any existing elements from the parent container (but not the header)
    let elementsToRemove = [].slice.call(
        document.querySelectorAll("div#speakers_container > *:not(h1)")
    );
    elementsToRemove.forEach(ele => speakersContainer.removeChild(ele));

    // Add the new elements
    speakersObjects.forEach(speaker => speakersContainer.appendChild(createSpeakerContainer(speaker)));
}

function generateWorkshopContainers(workshopsObjects) {
    // Remove any existing elements from the parent container (but not the header)
    let elementsToRemove = [].slice.call(
        document.querySelectorAll("div#workshops_container > *:not(h1)")
    );
    elementsToRemove.forEach(ele => workshopsContainer.removeChild(ele));

    // Add the new elements
    workshopsObjects.forEach(workshop => workshopsContainer.appendChild(createWorkshopContainer(workshop)));
}

function parseList(fileContents) {
    let objects = [];

    let lines = fileContents.split("\n");
    if (lines[lines.length - 1] != "-") lines.push("-");

    let foundStart = false;
    let currentObjectLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!foundStart) {
            if (line == "-----") foundStart = true;
            continue;
        }
        if (line == "") continue;
        if (line == "-") {
            if (currentObjectLines.length > 2) {
                let imgSrc = currentObjectLines[0];
                let name = currentObjectLines[1];
                let descriptionArray = currentObjectLines.slice(2);
                objects.push({imgSrc, name, descriptionArray});
            }
            currentObjectLines = [];
        } else {
            currentObjectLines.push(line);
        }
    }

    return objects;
}

async function fetchList(url) {
    let response = await fetch(url);
    if (!response.ok) return;

    return await response.text();
}

async function loadSpeakers() {
    let speakersFileContents = await fetchList("/speakers.txt");
    if (!speakersFileContents) return;
    let speakersObjects = parseList(speakersFileContents);
    if (speakersObjects.length == 0) return;
    generateSpeakersContainers(speakersObjects);
}

async function loadWorkshops() {
    let workshopsFileContents = await fetchList("/workshops.txt");
    if (!workshopsFileContents) return;
    let workshopsObjects = parseList(workshopsFileContents);
    if (workshopsObjects.length == 0) return;
    generateWorkshopContainers(workshopsObjects);
}

loadSpeakers();
loadWorkshops();