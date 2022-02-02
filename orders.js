doc = document.getElementById("sec-214c")
dburl = "https://database.beepositiveapiary.com/"

renderpage = async() => {
    incomplete = ""
    complete = ""
    orders = JSON.parse(await fetch(dburl+"get/"+document.getElementById("pswdinput").value+"/orders").then(data => {return data.text()}))
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
    if(order["isComplete"]) {
        html = `Order for <b>${order["name"]}</b> placed on <b>${date.toString()}:</b> <button onClick="markAsIncomplete(${order["id"]})">Mark as incomplete</button><br>`
    } else {
        html = `Order for <b>${order["name"]}</b> placed on <b>${date.toString()}:</b> <button onClick="markAsComplete(${order["id"]})">Mark as complete</button><br>`
    }
    
    order["items"] = JSON.parse(order["items"])
    for(var item in order["items"]) {
        html += `${order["items"][item]}x ${item}<br>`
    }
    return html + "<br><br>"
}

renderpage()

markAsComplete = async (i) => {
    await fetch(`${dburl}complete/${i}/true`)
    await renderpage()
}

markAsIncomplete = async (i) => {
    await fetch(`${dburl}complete/${i}/false`)
    await renderpage()
}