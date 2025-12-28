let sponsorsTable = document.getElementById("sponsors_table");

function createSponsorContainer(sponsor) {
    let sponsorContainer = document.createElement("td");

    let img = document.createElement("img");
    img.src = sponsor.imgSrc;
    img.alt = `${sponsor.name} logo`;
    sponsorContainer.appendChild(img);

    return sponsorContainer;
}

function generateSponsorContainers(sponsorObjects) {
    sponsorsTable.innerHTML = "";
    
    let tbody = document.createElement("tbody");

    let containers = sponsorObjects.map(sponsorObject => createSponsorContainer(sponsorObject));
    let currentTr = document.createElement("tr");
    for (let i = 0; i < containers.length; i++) {
        currentTr.appendChild(containers[i]);
        if (i % 3 == 2) {
            tbody.appendChild(currentTr);
            currentTr = document.createElement("tr");
        }
    }
    if (currentTr.childElementCount > 0) tbody.appendChild(currentTr);

    sponsorsTable.appendChild(tbody);
}

function parseSponsorsList(sponsorsFileContents) {
    let sponsors = [];

    let lines = sponsorsFileContents.split("\n");
    if (lines[lines.length - 1] != "") lines.push("");

    let foundStart = false;
    let currentSponsor = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!foundStart) {
            if (line == "-----") foundStart = true;
            continue;
        }
        if (line == "") {
            if (currentSponsor.length == 2) {
                let imgSrc = currentSponsor[0];
                let name = currentSponsor[1];
                sponsors.push({imgSrc, name});
            }
            currentSponsor = [];
        } else {
            currentSponsor.push(line);
        }
    }

    return sponsors;
}

async function fetchSponsorsList() {
    let url = "/sponsors.txt";

    let response = await fetch(url);
    if (!response.ok) {
        alert("Something went wrong while trying to fetch sponsors' details. Please try again later.");
        return;
    }

    return await response.text();
}

async function loadSponsors() {
    let sponsorsFileContents = await fetchSponsorsList();
    let sponsorObjects = parseSponsorsList(sponsorsFileContents);
    generateSponsorContainers(sponsorObjects);
}

loadSponsors();