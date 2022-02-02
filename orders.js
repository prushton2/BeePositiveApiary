doc = document.getElementById("sec-214c")
dburl = "https://beepositiveapiarynodeserver.prushton.repl.co/"

renderpage = async() => {
    orders = JSON.parse(await getURLWithoutCors(dburl+"get/"/*+document.getElementById("pswdinput").value+*/+"password/orders"))
    allHTML = ""
    for(var order in orders) {
        allHTML += createItemHTML(orders[order])
    }
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${allHTML}</div>`
}

createItemHTML = (order) => {
    html = `Order for ${order["name"]} placed on ${order["date"]}:<br>`
    order["items"] = JSON.parse(order["items"])
    for(var item in order["items"]) {
        html += `${order["items"][item]}x ${item}<br>`
    }
    return html + "<br><br>"
}

renderpage()