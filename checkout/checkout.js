shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

console.log(shoppingList)
function createHTML(product, order) { // products[item], shoppingList[item]
    return `<div><div><label>${product["name"]}</label><br><label>${product["description"]}</label></div><div style='text-align: right;'><label>$${product["price"]}</label>&nbsp&nbsp&nbspx<input onchange="updateShoppingList()" id="Count of ${order["productID"]}" value=${order["amount"]}></div></div><br>`
}

function createAllHtml(jsonobject) {
    html = ""
    for(var key in jsonobject["Items"]) {
        productID = jsonobject["Items"][key]["productID"]        
        html += createHTML(products[productID], jsonobject["Items"][key])
    }
    return html
}

function gotofinalize() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../finalize/Finalize.html"
}

function updateShoppingList() {
    
    for(key in shoppingList["Items"]) {
        item = shoppingList["Items"][key]

        newAmount = parseFloat(document.getElementById(`Count of ${item["productID"]}`).value)
        
        newAmount = setItemAmountToIncrement(item["productID"], newAmount)

        document.getElementById(`Count of ${item["productID"]}`).value = newAmount

        shoppingList["Items"][key]["amount"] = newAmount
    }
    
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList["Items"])}`
}

document.getElementById("sec-9fb3").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList["Items"])}`