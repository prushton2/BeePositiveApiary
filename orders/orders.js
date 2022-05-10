doc = document.getElementById("sec-214c")
password = document.getElementById("pswdinput")

renderpage = async() => { //this function feels bloated, I want to shrink it down a bit
    incomplete = ""
    complete = ""
    archived = ""

    await products.getProducts()

    //get all unarchived orders
    response = await httpRequest(`${dburl}/getOrders`, "POST", {
        password: password.value,
        getArchived: false
    }, false)

    orders = response["response"]

    if(orders == "Invalid Credentials") { //if the password is wrong (only happens once)
        alert("Incorrect Password")
        return
    }

    for(var order in orders) {

        //get all items for each order
        items = await httpRequest(`${dburl}/getPurchases`, "POST", {
            password: password.value,
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
    response = await httpRequest(`${dburl}/getOrders`, "POST", {
        password: password.value,
        getArchived: true,
    }, false)

    orders = response["response"]

    for(var order in orders) {
        //get all items for each archived order
        items = await httpRequest(`${dburl}/getPurchases`, "POST", {
            password: password.value,
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
    date = new Date(parseInt(order["date"]))
    date = date.toString().split(" GMT")[0] //remove the timezone
    
    html = `Order for <b>${order["name"]}</b> placed on <b>${date}:</b>`
    
    if(!isArchived) {
        html += `<button onClick="markAsComplete('${order["id"]}', ${!order["isComplete"]})">Mark as ${order["isComplete"] ? "incomplete" : "complete"}</button>`
    }

    if(order["isComplete"] && !isArchived) {
        html += `<button onClick="sendCompletionEmail('${order["id"]}', '${order["name"]}')">${order["emailSent"] ? "Completion Email Sent" : "Send Completion Email"}</button>`
        html += `<button onClick="archiveItem('${order["id"]}', '${order["name"]}')">Archive Item</button>`
    }
    html += '<br>' 
    
    html += `Total Cost: <b>${await products.getDisplayCost(items)}</b><br>`
    html += `Order Contents:<br>`
    
    for(var item in items) { 
        item = items[item]
        subproduct = item["subProductID"] == "0" ? "" : `${(await products.getProduct(item["subProductID"]))["name"]} of`
        html += `&nbsp&nbsp&nbsp• ${item["amount"]}x ${subproduct} ${(await products.getProduct(item["productID"]))["name"]}<br>`
    }
    return html + "<br><br>"
}


markAsComplete = async(i, complete) => {
    response = await fetch(`${dburl}/complete`, {
        method: "POST", headers: {"Accept": "applcation/json", "Content-Type": "application/json"},
        body: JSON.stringify(
            {
                "password": password.value,
                "orderID": i,
                "completeStatus": complete
            }
        )
    })
    await renderpage()
}

sendCompletionEmail = async(orderID, name) => {
    if(confirm(`Are you sure you want to send a completion email to ${name}?`)) {
        response = await httpRequest(`${dburl}/sendCompletionEmail`, "POST", {
            password: password.value,
            orderID: orderID
        }, false)
        alert(response["response"])
    }
}

archiveItem = async(id, name) => {
    let text = `Are you sure you would like to archive ${name}'s order?\n (ID: ${id})`;
    if (confirm(text)) {
        await fetch(`${dburl}/archive`, {
            method: "POST", headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                "password": password.value,
                "orderID": id
            })
        })
        alert(`${name}'s order has been archived`)
    }
    await renderpage()
}