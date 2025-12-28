function handleTicketsFile(ticketsFileContents) {
    let lines = ticketsFileContents.split("\n");

    let ticketsAvailable = false;
    let ticketLink = "";
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.toUpperCase().startsWith("TICKETS AVAILABLE")) {
            ticketsAvailable = line.toUpperCase().endsWith("YES");
        } else if (line.toUpperCase().startsWith("TICKET LINK")) {
            ticketLink = line.substring(line.indexOf(":") + 1).trim();
        }
    }

    if (ticketsAvailable) {
        let ticketSalesContainer = document.getElementById("ticket_sales_container");
        if (ticketSalesContainer) {
            ticketSalesContainer.style.display = "flex";
        }
        let buttonLink = document.querySelector("#ticket_sales_container a");
        if (buttonLink) {
            buttonLink.href = ticketLink;
        }
        [].slice.call(
            document.querySelectorAll(".remove_when_tickets_available")
        ).forEach(i => {
            i.parentElement.removeChild(i)
        });
    }
}

async function fetchTicketsFile() {
    let url = "/tickets.txt";

    let response = await fetch(url);
    if (!response.ok) return;

    return await response.text();
}

async function checkForTickets() {
    let ticketsFileContents = await fetchTicketsFile();
    handleTicketsFile(ticketsFileContents);
}

checkForTickets();