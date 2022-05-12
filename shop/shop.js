// Requires itemInfo.js
import * as utils from "../utils.js"

let shoppingList = localStorage.getItem("shoppingList")

let test = shoppingList

try { //this handle cases where the shoppinglist doesnt work
    test = JSON.parse(test)
    test["Items"].push({"key": "value"})
} catch {
    shoppingList = '{"Items":[]}'
}

shoppingList = JSON.parse(shoppingList)

export async function addToCart(item, hasSubproduct=false) { //Subproduct is used for something like a jar of honey, where the jar is the subproduct and the honey is the item
    amountToAdd = parseFloat(document.getElementById(`Count of ${item}`).value)
    amountToAdd = await utils.products.setItemAmountToIncrement(item, amountToAdd)
    
    if(hasSubproduct) { //if we have a subproduct, we need to add the subproduct to the shoppinglist and make sure the amount of the subproduct follows the increment of the item
        subProduct = document.getElementById(`Subproduct of ${item}`).value
        amountToAdd = await utils.products.setItemAmountToIncrement(subProduct, amountToAdd)
    } else {
        subProduct = 0 //0 is the empty value for subproduct
    }
    
    for(i in shoppingList["Items"]) { //Look for the item if it is already in the shoppinglist.
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

export async function updateDisplayPrice(productID) { //update the displayed price of the item
    subProduct = document.getElementById(`Subproduct of ${productID}`).value
    subProductRelation = await utils.products.getProductRelation(productID, subProduct)
    document.getElementById(`price of ${productID}`).innerHTML = `$${subProductRelation["price"]}`
}

export async function createHTML(itemID, extraStyle="") { //create the html for the item
    let item = await utils.products.getProduct(itemID)
    let subProducts = await utils.products.getProductRelations(itemID)


    let subproductsDropdownHTML = ``

    for(let i in subProducts) {
        if(subProducts[i]["subProductId"] != 0) {
            let subproduct = await utils.products.getProduct(subProducts[i]["subProductId"])
            subproductsDropdownHTML += `<option value="${subProducts[i]["subProductId"]}">${subproduct["name"]}</option>`
        }
    }
    let subProductHTML = `
        <form> Size 
            <select id="Subproduct of ${itemID}" onChange="updateDisplayPrice(${itemID})">
                ${subproductsDropdownHTML}
            </select>
        </form>
    `
    if(subproductsDropdownHTML == "") {
        subProductHTML = ""
    }
    item["price"] = subProducts[0]["price"]
    let htmlString = `
    <div style="${extraStyle}">
        <table>
            <tr style="text-align: left;">
                <td style="width: 180px; height: 180px;"> <img src="${item["imageURL"]}" style="width:170px;"> </td>
                <td> <label>${item["name"]}</label> <br> <label>${item["description"]}</label> </td>
            </tr>
            <tr>
                <td> <label id="price of ${itemID}">$${item["price"]}</label> <br><br></td>
            </tr>
            <tr style="vertical-align: bottom;">
                <td id="subproducts"> 
                    ${subProductHTML} 
                </td>
                <td style="text-align: right;"> <input id="Count of ${itemID}" style="width: 75px;" value="1" type="number" step="1"> Quantity </td>
            </tr>
            <tr>
                <td> </td>
                <td style="vertical-align: top; text-align: right;"></b><button onClick="addToCart(${itemID}, ${subProductHTML != ""})" class="u-btn-round u-button-style u-custom-item u-hover-palette-1-light-1 u-palette-1-base u-radius-6 u-btn-2" style="padding: 10px 20px;" ><b>Add to Cart</b></button></td>
            </tr>
        </table>
    </div>`

    return htmlString

}