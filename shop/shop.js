// Requires itemInfo.js
import * as utils from "../utils.js"

//initialize the shopping list
export let shoppingList = localStorage.getItem("shoppingList")

let test = shoppingList

try { //this handle cases where the shoppinglist doesnt work. If it doesnt work, it will create a new shopping list
    test = JSON.parse(test)
    test["Items"].push({"key": "value"})
} catch {
    shoppingList = '{"Items":[]}'
}
shoppingList = JSON.parse(shoppingList)

export async function addToCart(item) { //Subproduct is used for something like a jar of honey, where the jar is the subproduct and the honey is the item
    let amountToAdd = parseInt(document.getElementById(`Count of ${item}`).value)
    
    let subProduct
    try { //if we have a subproduct, we need to add the subproduct to the shoppinglist and make sure the amount of the subproduct follows the increment of the item
        subProduct = document.getElementById(`Subproduct of ${item}`).value
    } catch {
        subProduct = 0 //0 is the empty value for subproduct
    }
    
    for(let i in shoppingList["Items"]) { //Look for the item if it is already in the shoppinglist.
        if(shoppingList["Items"][i]["productID"] == item && shoppingList["Items"][i]["subProductID"] == subProduct) {
            shoppingList["Items"][i]["amount"] += amountToAdd //Add the amount to the existing item in the shoppingList and return
            checkout()
            return;
        }
    }
    // Create a new entry for the item in the shoppinglist if there isnt an entry already
    try {
        shoppingList["Items"].push( {
            "productID": item,
            "subProductID": subProduct,
            "amount": amountToAdd
        })
    } catch { //handle issues give an immediate solution
        if(confirm("There was an error adding items to your cart. Press Ok to clear your cart")) {
            localStorage.setItem("shoppingList", '{"Items":[]}')
            shoppingList = {"Items":[]}
            alert("Your cart is cleared. Try adding the items again")
        }
        return
    }
    checkout()
}

export function checkout() { //save the shoppinglist and go to the checkout
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}

export async function updateDisplay(productID) { //update the displayed price of the item
    let subProduct = document.getElementById(`Subproduct of ${productID}`).value
    let subProductRelation = await utils.products.getProductRelation(productID, subProduct)
    document.getElementById(`price of ${productID}`).innerHTML = `$${subProductRelation["price"]}`
    document.getElementById(`Image of ${productID}`).src = subProductRelation["imageURL"]
}

export async function createHTML(itemID, extraStyle="") { //create the html for the item
    let item = await utils.products.getProduct(itemID)
    let subProducts = await utils.products.getProductRelations(itemID)


    let subproductsDropdownHTML = ``

    for(let i in subProducts) {
        if(subProducts[i]["subProductID"] != 0) {
            let subproduct = await utils.products.getProduct(subProducts[i]["subProductID"])
            subproductsDropdownHTML += `<option value="${subProducts[i]["subProductID"]}">${subproduct["name"]}${subproduct["stock"] == 0 ? " (OUT OF STOCK)" : ""}</option>`
        }
    }
    let subProductHTML = `
        <form> Size 
            <select id="Subproduct of ${itemID}">
                ${subproductsDropdownHTML}
            </select>
        </form>
    `
    if(subproductsDropdownHTML == "") {
        subProductHTML = ""
    }
    item["price"] = subProducts[0]["price"]

    let itemImage = subProducts[0]["imageURL"]

    let htmlString = `
    <div style="${extraStyle}">
        <table>
            <tr style="text-align: left;">
                <td style="width: 180px; height: 180px;"> <img src="${itemImage}" style="width:170px;" id="Image of ${itemID}"> </td>
                <td> <label>${item["name"]}</label> <br> <label>${item["description"]}</label> </td>
            </tr>
            <tr>
                <td> <label id="price of ${itemID}">$${item["price"]}</label> <br> ${item["stock"] == 0 ? "<label style='color: Tomato'>OUT OF STOCK</label>" : ""} <br></td>
            </tr>
            <tr style="vertical-align: bottom;">
                <td> 
                    ${subProductHTML} 
                </td>
                <td style="text-align: right;"> <input id="Count of ${itemID}" style="width: 75px;" value="1" type="number" step="1"> Quantity </td>
            </tr>
            <tr>
                <td> ${item["stock"] <= 5 ? `Only ${item["stock"]} left` : ""} </td>
                <td style="vertical-align: top; text-align: right;"></b><button id="Add to cart ${itemID}"  class="u-btn-round u-button-style u-custom-item u-hover-palette-1-light-1 u-palette-1-base u-radius-6 u-btn-2" style="padding: 10px 20px;" ><b>Add to Cart</b></button></td>
            </tr>
        </table>
    </div>`

    return htmlString

}

export async function createAllHTML(items) {
    let allHTML = ""
    let halfwidth = document.documentElement.clientWidth/2
    for (let j in items) {
        let i = items[j]
        allHTML += await createHTML(i[0], `position: absolute; left:  ${halfwidth-550}px; margin-top: ${50 + (j*450)}px;`)
        allHTML += await createHTML(i[1], `position: absolute; right: ${halfwidth-550}px; margin-top: ${50 + (j*450)}px;`)
        allHTML += "<br>"
    }
    return allHTML
}

export function addEventListeners(items) {
    for (let i in items) {
        for (let j in items[i]) {
            j = items[i][j]
            document.getElementById(`Add to cart ${j}`).addEventListener("click", async() => { await addToCart(j) })
            try {
                document.getElementById(`Subproduct of ${j}`).addEventListener("change", async() => { await updateDisplay(j) })
            } catch {}
        }
    }
}