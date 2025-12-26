let peopleContainer = document.getElementById("people_container");

function createPersonContainer(person) {
    let personContainer = document.createElement("div");
    personContainer.className = "person_container";

    let img = document.createElement("img");
    img.src = person.imgSrc;
    personContainer.appendChild(img);

    let descriptionContainer = document.createElement("div");
    descriptionContainer.className = "description_container";

        let nameElement = document.createElement("span");
        nameElement.className = "person_name";
        nameElement.appendChild(document.createTextNode(person.name));
        descriptionContainer.appendChild(nameElement);

        let roleElement = document.createElement("span");
        roleElement.className = "person_role";
        roleElement.appendChild(document.createTextNode(person.role));
        descriptionContainer.appendChild(roleElement);

        let emailElement = document.createElement("a");
        emailElement.className = "person_email unstyled";
        emailElement.href = `mailto:${person.email}`;
        emailElement.appendChild(document.createTextNode(person.email));
        descriptionContainer.appendChild(emailElement);

    personContainer.appendChild(descriptionContainer);

    return personContainer;
}

function generatePeopleContainers(peopleObjects) {
    peopleContainer.innerHTML = "";

    let importantContainer = document.createElement("div");
    importantContainer.className = "important_container";
    let importantPeople = peopleObjects.filter(i => i.important);
    importantPeople.forEach(person => importantContainer.appendChild(createPersonContainer(person)));
    peopleContainer.appendChild(importantContainer);

    let remainingContainer = document.createElement("div");
    remainingContainer.className = "remaining_container";
    let lessImportantPeople = peopleObjects.filter(i => !i.important);
    lessImportantPeople.forEach(person => remainingContainer.appendChild(createPersonContainer(person)));
    peopleContainer.appendChild(remainingContainer);
}

function parsePeopleList(peopleFileContents) {
    let people = [];

    let lines = peopleFileContents.split("\n");
    if (lines[lines.length - 1] != "") lines.push("");
    
    let foundStart = false;
    let currentPerson = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!foundStart) {
            if (line == "-----") foundStart = true;
            continue;
        }
        if (line == "") {
            if (currentPerson.length == 4) {
                let imgSrc = currentPerson[0];
                let name = currentPerson[1];
                let important = false;
                if (name.startsWith("[Important] ")) {
                    important = true;
                    name = name.substring(12);
                }
                let role = currentPerson[2];
                let email = currentPerson[3];
                people.push({
                    imgSrc, name, important, role, email
                });
            }
            currentPerson = [];
        } else {
            currentPerson.push(line);
        }
    }

    return people;
}

async function fetchPeopleList() {
    let url = "/people.txt";

    let response = await fetch(url);
    if (!response.ok) {
        alert("Something went wrong while trying to fetch people's details. Please try again later.");
        return;
    }
    
    return await response.text();
}

async function loadPeople() {
    let peopleFileContents = await fetchPeopleList();
    let peopleObjects = parsePeopleList(peopleFileContents);
    generatePeopleContainers(peopleObjects);
}

loadPeople();