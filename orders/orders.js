doc = document.getElementById("sec-214c")
password = document.getElementById("pswdinput")

renderpage = async() => {
    incomplete = ""
    complete = ""
    response = await fetch(`${dburl}/getOrders`, {
        method: "POST",headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            password:"devpassword"
        })}).then(data => {return data.text()})

    orders = JSON.parse(response)["response"]

    for(var order in orders) {
        if(orders[order]["isComplete"]) {
            complete += await createItemHTML(orders[order])
        } else {
            incomplete += await createItemHTML(orders[order])
        }
    }
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">Incomplete<br><br><br>${incomplete}<br><br><br>Complete<br><br><br>${complete}</div>`
}

async function createItemHTML(order) {
    date = new Date(parseInt(order["date"]))
    date = date.toString().split(" GMT")[0]
    html = `Order for <b>${order["name"]}</b> placed on <b>${date}:</b> <button onClick="markAsComplete('${order["id"]}', ${!order["isComplete"]})">Mark as ${order["isComplete"] ? "incomplete" : "complete"}</button>`
    
    items = await fetch(`${dburl}/getPurchases`, {
        method: "POST", headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            password: password.value,
            orderID: order["id"]
        })}).then(data => {return data.text()})
    items = JSON.parse(items)["response"]
    
        
    
    if(order["isComplete"]) {
        html += `<button onClick="archiveItem('${order["id"]}', '${order["name"]}')">Archive Item</button><br>`
    } else {
        html += '<br>'
    }
    html += `Total Cost: <b>${getDisplayCost(items)}</b><br>`
    html += `Order Contents:<br>`
    
    for(var item in items) { 
        item = items[item]
        html += `&nbsp&nbsp&nbsp• ${item["amount"]}x ${products[item["productID"]]["name"]}<br>`
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