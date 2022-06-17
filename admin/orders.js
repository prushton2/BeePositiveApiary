import * as utils from "../utils.js"
import * as config from "../config.js"

let doc = document.getElementById("sec-214c")
let password = document.getElementById("pswdinput")

window.markAsComplete = markAsComplete
window.sendCompletionEmail = sendCompletionEmail
window.archiveItem = archiveItem

async function renderpage() { //this function feels bloated, I want to shrink it down a bit
    let incomplete = ""
    let complete = ""
    let archived = ""

    //get all unarchived orders
    let response = await utils.httpRequest(`${config.dburl}/orders/get`, "POST", {
        getArchived: false
    }, false)

    let orders = response["response"]

    if(orders == "Invalid Credentials") { //if the password is wrong (only happens once)
        alert("Incorrect Password")
        return
    }

    for(var order in orders) {

        //get all items for each order
        let items = await utils.httpRequest(`${config.dburl}/purchases/get`, "POST", {
            orderID: orders[order]["id"],
            getArchived: false  
        }, false)

        items = items["response"]

        //sort orders based on completeness
        if(orders[order]["isComplete"]) {
            complete += await createItemHTML(orders[order], items, false)
        } else {
            incomplete += await createItemHTML(orders[order], items, false)
        }
    }

    //get all archived orders
    response = await utils.httpRequest(`${config.dburl}/orders/get`, "POST", {
        getArchived: true,
    }, false)

    orders = response["response"]

    for(var order in orders) {
        //get all items for each archived order
        let items = await utils.httpRequest(`${config.dburl}/purchases/get`, "POST", {
            orderID: orders[order]["id"],
            getArchived: true
        }, false)
        items = items["response"]

        archived += await createItemHTML(orders[order], items, true)
    }

    //this looks awful, but its just a bunch of line breaks with titles
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">Incomplete<br><br><br>${incomplete}<br><br><br>Complete<br><br><br>${complete}Archived<br><br><br>${archived}</div>`
}

async function createItemHTML(order, items, isArchived) {
    let date = new Date(parseInt(order["date"]))
    date = date.toString().split(" GMT")[0] //remove the timezone
    
    let html = `Order for <b>${order["name"]}</b> placed on <b>${date}:</b>`
    
    if(!isArchived) {
        html += `<button onClick="markAsComplete('${order["id"]}', ${!order["isComplete"]})">Mark as ${order["isComplete"] ? "incomplete" : "complete"}</button>`
    }

    if(order["isComplete"] && !isArchived) {
        html += `<button onClick="sendCompletionEmail('${order["id"]}', '${order["name"]}')">${order["emailSent"] ? "Completion Email Sent" : "Send Completion Email"}</button>`
        html += `<button onClick="archiveItem('${order["id"]}', '${order["name"]}')">Archive Item</button>`
    }
    html += '<br>' 
    
    html += `Total Cost: <b>${utils.products.getDisplayCost(items)}</b><br>`
    html += `Order Contents:<br>`
    
    for(var item in items) { 
        item = items[item]
        let subproduct = item["subProductID"] == "0" ? "" : `${(await utils.products.getProduct(item["subProductID"]))["name"]} of`
        html += `&nbsp&nbsp&nbsp• ${item["amount"]}x ${subproduct} ${(await utils.products.getProduct(item["productID"]))["name"]}<br>`
    }
    return html + "<br><br>"
}


async function markAsComplete(i, complete) {

    let response = await utils.httpRequest(`${config.dburl}/orders/complete`, "PATCH", 
    {
        "orderID": i,
        "isComplete": complete
    }, false)
    await renderpage()
}

async function sendCompletionEmail(orderID, name) {
    if(confirm(`Are you sure you want to send a completion email to ${name}?`)) {
        let response = await utils.httpRequest(`${config.dburl}/email/completionEmail`, "POST", 
        {
            "orderID": orderID
        }, false)
        alert(response["response"])
        await renderpage()
    }
}

async function archiveItem(id, name) {
    let text = `Are you sure you would like to archive ${name}'s order?\n (ID: ${id})`;
    if (confirm(text)) {

        await utils.httpRequest(`${config.dburl}/orders/archive`, "POST",
        {
            "orderID": id
        }, true)
        alert(`${name}'s order has been archived`)
    }
    await renderpage()
}

document.getElementById("renderPageButton").addEventListener("click", renderpage)