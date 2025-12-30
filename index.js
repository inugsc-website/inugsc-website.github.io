let fadeInContainers = [].slice.call(
    document.querySelectorAll(".fade_in_while_scrolling")
);

function testForFadeIn() {
    fadeInContainers.forEach(container => {
        if (container.className.indexOf("transition_performed") != -1) return;

        let rect = container.getBoundingClientRect();
        let threshold = window.innerHeight - 100;
        if (rect.y < threshold) {
            container.className += " transition_performed";
        }
    });
}

function checkForAnchor() {
    if (location.hash == "") return;

    let anchor = location.hash.substring(1);
    let anchorElement = document.getElementById(`anchor_${anchor}`);

    if (!anchorElement) return;

    let headerHeight = document.querySelector("header").getBoundingClientRect().height;
    let scrollPosition = (anchorElement.getBoundingClientRect().y + window.scrollY) - headerHeight;
    if (scrollPosition < 0) scrollPosition = 0;

    window.scrollTo({top: scrollPosition, behavior: "smooth"});
}

function scrollEventListener() {
    testForFadeIn();
}

function loadEventListener() {
    checkForAnchor();
    testForFadeIn();
}

function hashchangeEventListener() {
    checkForAnchor();
}

window.addEventListener("scroll", scrollEventListener);

window.addEventListener("load", loadEventListener);

window.addEventListener("hashchange", hashchangeEventListener);


let headerHamburger = document.getElementById("header_hamburger_container");
let headerListContainer = document.getElementById("header_list_container");

headerHamburger.addEventListener("click", () => {
    if (headerListContainer.style.maxHeight == "") {
        headerListContainer.style.maxHeight = "100vh";
    } else {
        headerListContainer.style.maxHeight = "";
    }
});

let headerLinks = [].slice.call(
    document.querySelectorAll("header div#header_list_container ul a")
);

headerLinks.forEach(headerLink => {
    headerLink.addEventListener("click", () => {
        if (getComputedStyle(headerHamburger).display == "block") {
            // If we are in mobile mode
            headerListContainer.style.maxHeight = "";
        }
    });
});
