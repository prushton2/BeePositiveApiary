const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

doc = document.getElementById("sec-9fb3")

shoppingList = {}
orderID = urlParams.get("ID")
password = urlParams.get("pswd")

renderpage = async(orderID, password) => {
    order = await fetch(`${dburl}getorder/${orderID}/${password}`).then(value => {return value.text()})
    order = JSON.parse(order)["response"]
    order["items"] = JSON.parse(order["items"])
    shoppingList = order["items"]

    html = ""
    document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList)}`

    for(let item in order["items"]) {
        console.log(item)
        html += createItemHTML(products[item], order["items"][item])
    }
    doc.innerHTML = `   <div class="u-clearfix u-sheet u-sheet-1"><b>Your Order:</b><br><br>${html}</div>`
}

function createItemHTML(item, count) {
    return `<div><div><label>${item["name"]}</label><br><label>${item["description"]}</label></div><div style='text-align: right;'><label>$${item["price"]}</label>&nbsp&nbsp&nbspx<input onchange="updateShoppingList()" id="Count of ${item["name"]}" value=${count}></div></div><br>`
}

function updateShoppingList() {
    for(var key in shoppingList) {
        shoppingList[key] = parseInt(document.getElementById(`Count of ${key}`).value)
    }
    document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList)}`
}

saveEdits = async() => {
    response = await fetch(`${dburl}setorder/${orderID}/${password}/${JSON.stringify(shoppingList)}`).then(value => {return value.text()})
    console.log(response)
}

renderpage(orderID, password)