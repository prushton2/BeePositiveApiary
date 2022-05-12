import * as utils from "../utils.js"

let shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

export async function createHTML(item) { //shoppingList[item], supposed to contain amount and subproductID
    let textbox = `<input style="width: 75px;" type="number" step="any" name="checkoutItemCount" id="Count of ${item["productID"]} ${item["subProductID"]}" value=${item["amount"]}>`
    
    let htmlString = `<div> <label>{productName}</label> <div style='float:right; text-align: right;'>{price}&nbsp&nbsp&nbspx${textbox}</div></div><br>`

    return utils.products.createItemNameString(item, htmlString)
}

export async function drawCheckout() {
    await utils.products.getProducts() 
    document.getElementById("CheckoutList").innerHTML = await createAllHtml(shoppingList)//`<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
    document.getElementById("totalCost").innerHTML = `${await utils.products.getTaxCalculation(shoppingList["Items"])}<br>Total Cost: ${await utils.products.getDisplayCost(shoppingList["Items"])}`

    for(let i = 0; i < document.getElementsByName("checkoutItemCount").length; i++) {
        document.getElementsByName("checkoutItemCount")[i].addEventListener("change", () => {
            updateShoppingList()
        })
    }


}

export async function createAllHtml(jsonobject) { //takes in the shoppinglist
    let html = ""
    for(let key in jsonobject["Items"]) {
        html += await createHTML(jsonobject["Items"][key])
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
    drawCheckout()
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

await drawCheckout()