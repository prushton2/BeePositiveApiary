const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

doc = document.getElementById("sec-ff05")

orderID = null
password = null

function getOrder(id, password) {
    orderID = urlParams.get("ID")
    password = urlParams.get("pswd")
}

renderpage = async(orderID, password) => {
    order = await fetch(`${dburl}getorder/${orderID}/${password}`).then(value => {return value.text()})
    console.log(order)
    doc.innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">Incomplete<br><br><br>${incomplete}<br><br><br>Complete<br><br><br>${complete}</div>`
}

function createItemHTML(item, count) {
    return `<div><div><label>${item["name"]}</label><br><label>${item["description"]}</label></div><div style='text-align: right;'><label>$${item["price"]}</label>&nbsp&nbsp&nbspx<input onchange="updateShoppingList()" id="Count of ${item["name"]}" value=${count}></div></div><br>`
}

getOrder()
renderpage(orderID, password)