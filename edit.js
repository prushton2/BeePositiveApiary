const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

getOrder = async(id, password) => {
    orderID = urlParams.get("ID")
    password = urlParams.get("pswd")
    console.log(orderID, password)
}

renderpage = async() => {
    incomplete = ""
    complete = ""
    response = JSON.parse(await fetch(`${dburl}getOrder/${password.value}/orders`).then(data => {return data.text()}))
    orders = response["response"]
    for(var order in orders) {
        if(orders[order]["isComplete"]) {
            complete += createItemHTML(orders[order])
        } else {
            incomplete += createItemHTML(orders[order])
        }
    }
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">Incomplete<br><br><br>${incomplete}<br><br><br>Complete<br><br><br>${complete}</div>`
}

function createItemHTML(order) {
    date = new Date(parseInt(order["date"]))
    html = `Order for <b>${order["name"]}</b> placed on <b>${date.toString()}:</b> <button onClick="markAsComplete('${order["id"]}', ${!order["isComplete"]})">Mark as ${order["isComplete"] ? "incomplete" : "complete"}</button>`
    order["items"] = JSON.parse(order["items"])
    
    if(order["isComplete"]) {
        html += `<button onClick="deleteItem('${order["id"]}')"> Delete Item</button><br>`
    } else {
        html += '<br>'
    }
    html += `Total Cost: <b>${getDisplayCost(order["items"])}</b><br>`
    html += `Order Contents:<br>`
    
    for(var item in order["items"]) {
        html += `&nbsp&nbsp&nbsp• ${order["items"][item]}x ${item}<br>`
    }
    return html + "<br><br>"
}