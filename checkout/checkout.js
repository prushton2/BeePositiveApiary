import * as utils from "../utils.js"

// Renders and updates the menu that allows you to change your order in checkout

let shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
let checkoutListName, totalCostName

export function createHTML(item) { //shoppingList[item] | item = {"productID": x, "subProductID": x, "amount": x}
    let textbox = `<input style="width: 75px;" type="number" step="any" name="checkoutItemCount" id="Count of ${item["productID"]} ${item["subProductID"]}" value=${item["amount"]}>`
    
    let htmlString = `<div> <label>{fullName}</label> <div style='float:right; text-align: right;'>\${price}&nbsp&nbsp&nbspx${textbox}&nbsp (\${totalPrice})</div></div><br>`

    return utils.products.createItemInfoString(item, htmlString)
}

export function drawCheckout(checkoutList, totalCost) {

    checkoutListName = checkoutList
    totalCostName = totalCost
    document.getElementById(checkoutListName).innerHTML = createAllHtml(shoppingList)//`<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
    document.getElementById(totalCostName).innerHTML = `${utils.products.getTaxCalculation(shoppingList["Items"])}<br>Total Cost: ${utils.products.getDisplayCost(shoppingList["Items"])}`
}

export function addEventListeners() {
    for(let i = 0; i < document.getElementsByName("checkoutItemCount").length; i++) {
        document.getElementsByName("checkoutItemCount")[i].addEventListener("change", updateShoppingList )
    }
}

export function createAllHtml(jsonobject) { //takes in the shoppinglist | jsonobject = {"Items": [ {"productID": x, "subProductID": x, "amount": x} ]}
    let html = ""
    for(let key in jsonobject["Items"]) {
        html += createHTML(jsonobject["Items"][key])
    }
    
    return html == "" ? "Your items will appear here when they have been added to the cart!" : html
}

export function gotofinalize() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "Finalize.html"
}

export async function updateShoppingList() {
    
    for(let key in shoppingList["Items"]) {
        let item = shoppingList["Items"][key]

        let newAmount = parseFloat(document.getElementById(`Count of ${item["productID"]} ${item["subProductID"]}`).value)
        
        if(newAmount <= 0) {
            shoppingList["Items"].splice(key, 1)
        } else {
            document.getElementById(`Count of ${item["productID"]} ${item["subProductID"]}`).value = newAmount
            shoppingList["Items"][key]["amount"] = newAmount
        }
    }
    
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    drawCheckout(checkoutListName, totalCostName)
    addEventListeners()
}

export function resetShoppingCart() {
    if(confirm("Are you sure you want to reset your shopping cart?")) {
        shoppingList = {
            "Items": []
        }
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
        window.location.reload()
        alert("Your shopping cart has been reset")
    }
}

//get the name of the html doc

if(utils.isMain("Checkout.html")) {
    drawCheckout("CheckoutList", "totalCost")
    addEventListeners()
    document.getElementById("resetShoppingCart").addEventListener("click", resetShoppingCart )
    document.getElementById("finalizeButton").addEventListener("click", gotofinalize )
}

