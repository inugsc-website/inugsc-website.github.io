let fadeInContainers = [].slice.call(
    document.querySelectorAll(".fade_in_while_scrolling")
);

let scrollingImageCanvases = [].slice.call(
    document.querySelectorAll("canvas.scrolling_image")
);

let scrollingImageObjects = scrollingImageCanvases.map(canvas => {
    let image = new Image();
    image.src = canvas.dataset.src;
    return image;
});

let canvasContexts = scrollingImageCanvases.map(canvas => canvas.getContext("2d"));

function updateScrollingImages() {
    let headerHeight = document.querySelector("header").clientHeight;
    let scalingFactor = Math.max(1.2, window.innerHeight / window.innerWidth * 1.2);
    for (let i = 0; i < scrollingImageCanvases.length; i++) {
        let canvas = scrollingImageCanvases[i];
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let context = canvasContexts[i];
        let imageObject = scrollingImageObjects[i];
        let imageAspectRatio = imageObject.width / imageObject.height;
        let yTranslation = - (canvas.getBoundingClientRect().y - headerHeight) / 1.5;
        if (canvas.width < canvas.height) {
            // Image fills whole height
            let imageHeight = canvas.height * scalingFactor;
            let imageWidth = imageHeight * imageAspectRatio;
            let xOffset = (canvas.width - imageWidth) / 2;
            context.drawImage(imageObject, xOffset, yTranslation, imageWidth, imageHeight);
        } else {
            // Image fills whole width
            let imageWidth = canvas.width * scalingFactor;
            let imageHeight = imageWidth / imageAspectRatio;
            let yOffset = (canvas.height - imageHeight) / 2;
            context.drawImage(imageObject, 0, yOffset + yTranslation, imageWidth, imageHeight);
        }
    }
}

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
    updateScrollingImages();
    testForFadeIn();
}

function loadEventListener() {
    testForFadeIn();
    checkForAnchor();
    updateScrollingImages();
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
