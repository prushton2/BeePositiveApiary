doc = document.getElementById("sec-214c")
dburl = "https://database.beepositiveapiary.com/"
password = document.getElementById("pswdinput")

renderpage = async() => {
    incomplete = ""
    complete = ""
    orders = JSON.parse(await fetch(`${dburl}get/${password.value}/orders`).then(data => {return data.text()}))
    for(var order in orders) {
        if(orders[order]["isComplete"]) {
            complete += createItemHTML(orders[order])
        } else {
            incomplete += createItemHTML(orders[order])
        }
    }
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">Incomplete<br><br><br>${incomplete}<br><br><br>Complete<br><br><br>${complete}</div>`
}

createItemHTML = (order) => {
    date = new Date(parseInt(order["date"]))
    html = `Order for <b>${order["name"]}</b> placed on <b>${date.toString()}:</b> <button onClick="markAsComplete(${order["id"]}, ${!order["isComplete"]})">Mark as ${order["isComplete"] ? "incomplete" : "complete"}</button>`
    order["items"] = JSON.parse(order["items"])
    
    if(order["isComplete"]) {
        html += `<button onClick="deleteItem(${order["id"]})"> Delete Item</button><br>`
    } else {
        html += '<br>'
    }
    html += `Total Cost: <b>$${getTotalCost(order["items"])}</b><br>`
    html += `Order Contents:<br>`
    
    for(var item in order["items"]) {
        html += `&nbsp&nbsp&nbsp• ${order["items"][item]}x ${item}<br>`
    }
    return html + "<br><br>"
}


markAsComplete = async (i, complete) => {
    await fetch(`${dburl}complete/${password.value}/${i}/${complete}`)
    await renderpage()
}

deleteItem = async(i) => {
    let text = `Are you sure you would like to delete order ${i}?`;
    if (confirm(text)) {
        await fetch(`${dburl}delete/${password.value}/${i}`)
        alert(`Item ${i} has been deleted`)
    }
    await renderpage()
}

function getTotalCost(shoppingList) {
    totalcost = 0;

    for (var item in shoppingList) {
        totalcost += shoppingList[item] * products[item]["price"]
    }
    return totalcost

}