shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

function createHTML(item) { //shoppingList[item], supposed to contain amount and subproductID
    let subProductLabel = item["subProductID"] == 0 ? "" : `${products.getProduct(item["subProductID"])["name"]} of`
    let label = `<label>${subProductLabel} ${products.getProduct(item["productID"])["name"]}</label>`
    let price = `<label>$${products.getProduct(item["productID"])["price"]}</label>&nbsp&nbsp&nbspx`
    let textbox = `<input style="width: 75px;" type="number" step="any" onchange="updateShoppingList()" id="Count of ${item["productID"]} ${item["subProductID"]}" value=${item["amount"]}>`

    return `<div>${label}<div style='float:right; text-align: right;'>${price}${textbox}</div></div><br>`
}

async function drawCheckout() {
    await products.getProducts() 
    document.getElementById("CheckoutList").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
    document.getElementById("totalCost").innerHTML = `${await products.getTaxCalculation(shoppingList["Items"])}<br>Total Cost: ${await products.getDisplayCost(shoppingList["Items"])}`
}

function createAllHtml(jsonobject) { //takes in the shoppinglist
    html = ""
    for(var key in jsonobject["Items"]) {
        productID = jsonobject["Items"][key]["productID"]        
        html += createHTML(jsonobject["Items"][key])
    }



    return html == "" ? "Your items will appear here when they have been added to the cart!" : html
}

function gotofinalize() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../finalize/Finalize.html"
}

async function updateShoppingList() {
    
    for(key in shoppingList["Items"]) {
        item = shoppingList["Items"][key]

        newAmount = parseFloat(document.getElementById(`Count of ${item["productID"]} ${item["subProductID"]}`).value)
        
        
        //set increment to subproductID if it isnt 0 else set it to productID
        if(item["subProductID"] != 0) {
            newAmount = await products.setItemAmountToIncrement(item["subProductID"], newAmount)
        } else {
            newAmount = await products.setItemAmountToIncrement(item["productID"], newAmount)
        }

        
        if(newAmount <= 0) {
            shoppingList["Items"].splice(key, 1)
        } else {
            document.getElementById(`Count of ${item["productID"]} ${item["subProductID"]}`).value = newAmount
            shoppingList["Items"][key]["amount"] = newAmount
        }
    }
    
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    drawCheckout()
}

function resetShoppingCart() {
    if(confirm("Are you sure you want to reset your shopping cart?")) {
        shoppingList = {
            "Items": []
        }
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
        window.location.reload()
        alert("Your shopping cart has been reset")
    }
}

drawCheckout()