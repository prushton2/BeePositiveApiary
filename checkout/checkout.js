shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

function createHTML(product, order) { // products[item], shoppingList[item]
    return    `<div> <label>${product["name"]}</label>  <div style='float:right; text-align: right;'><label>$${product["price"]}</label>&nbsp&nbsp&nbspx<input style="width: 75px;" type="number" step="any" onchange="updateShoppingList()" id="Count of ${order["productID"]}" value=${order["amount"]}>${product["unit"]}</div></div><br>`
}

function drawCheckout() {
    document.getElementById("CheckoutList").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
    document.getElementById("totalCost").innerHTML = `${getTaxCalculation(shoppingList["Items"])}<br>Total Cost: ${getDisplayCost(shoppingList["Items"])}`
}

function createAllHtml(jsonobject) { //takes in the shoppinglist
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
        if(newAmount <= 0) {
            shoppingList["Items"].splice(key, 1)
        } else {
            document.getElementById(`Count of ${item["productID"]}`).value = newAmount
            shoppingList["Items"][key]["amount"] = newAmount
        }
    }
    
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    drawCheckout()
}

drawCheckout()