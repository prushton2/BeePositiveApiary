shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

function createHTML(item) { //shoppingList[item], supposed to contain amount and subproductID
    // console.log(products.getProduct(item["productID"]))
    let subProductLabel = item["subProductID"] == 0 ? "" : `${products.getProduct(item["subProductID"])["name"]} of`
    let label = `<label>${subProductLabel} ${products.getProduct(item["productID"])["name"]}</label>`
    let price = `<label>$${products.getProduct(item["productID"])["price"]}</label>&nbsp&nbsp&nbspx`
    let textbox = `<input style="width: 75px;" type="number" step="any" onchange="updateShoppingList()" id="Count of ${item["productID"]}" value=${item["amount"]}>`

    return `<div>${label}<div style='float:right; text-align: right;'>${price}${textbox}</div></div><br>`
}

async function drawCheckout() {
    await products.getProducts() 
    document.getElementById("CheckoutList").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
    document.getElementById("totalCost").innerHTML = `${getTaxCalculation(shoppingList["Items"])}<br>Total Cost: ${getDisplayCost(shoppingList["Items"])}`
}

function createAllHtml(jsonobject) { //takes in the shoppinglist
    html = ""
    for(var key in jsonobject["Items"]) {
        productID = jsonobject["Items"][key]["productID"]        
        html += createHTML(jsonobject["Items"][key])
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