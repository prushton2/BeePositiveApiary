//this script holds basic functions needed for any page to work, also requires the itemInfo.js file
import * as item from "./itemInfo.js"

let dropdown = document.getElementById("cartButton") //Render the shoppinglist in the cart dropdown
let cartContents = document.getElementById("cartButtonContents")
dropdown.addEventListener("mouseover", async(e) => {
    await products.getProducts()
    html = ""
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(key in shoppingList["Items"]) {
        subproduct = shoppingList["Items"][key]["subProductID"] == 0 ? "" : `${(await item.products.getProduct(shoppingList["Items"][key]["subProductID"]))["name"]} of `
        html += `<a href="#">${shoppingList["Items"][key]["amount"]}x ${subproduct}${(await item.products.getProduct(shoppingList["Items"][key]["productID"]))["name"]}`
    }
    cartContents.innerHTML = html
})


//cleaner http requests with automatic error handling
async function httpRequest(url, method, body, makeAlertOnError) {

    response = await fetch(url, {
        method: method, headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    
    if(response.status >= 200 && response.status < 300) {
        text = await response.text()
        return JSON.parse(text)
    } else {
        if(makeAlertOnError) {
            alert("There was an error making your request")
        }
        text = await response.text()
        return JSON.parse(text)
    }
}