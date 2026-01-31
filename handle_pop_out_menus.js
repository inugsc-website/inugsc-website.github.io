let popOutMenus = [].slice.call(document.querySelectorAll("div.pop_out_menu"));
popOutMenus.forEach(popOutMenu => {
    // We expect <li> as the parent
    let li = popOutMenu.parentElement;
    li.addEventListener("mouseover", () => {
        if (!inMobileMode()) {
            hideOtherPopOutMenus(popOutMenu);
            popOutMenu.style.display = "initial";
        }
    });
    let popOutActivate = li.querySelector("img.pop_out_activate");
    popOutActivate.addEventListener("click", () => {
        if (popOutMenu.style.display == "initial") {
            popOutMenu.style.display = "";
        } else {
            popOutMenu.style.display = "initial";
        }
    });
});

let main = document.querySelector("main");
main.addEventListener("mouseenter", () => {
    hideOtherPopOutMenus(null);
});

function hideOtherPopOutMenus(whichToNotHide) {
    popOutMenus.forEach(popOutMenu => {
        if (popOutMenu != whichToNotHide) popOutMenu.style.display = "";
    });
}

function inMobileMode() {
    return window.innerWidth <= 1000;
}