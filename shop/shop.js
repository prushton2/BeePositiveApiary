// Requires itemInfo.js

shoppingList = localStorage.getItem("shoppingList")

test = shoppingList

try { //this handle cases where the shoppinglist doesnt work
    test = JSON.parse(test)
    test["Items"].push({"key": "value"})
} catch {
    shoppingList = '{"Items":[]}'
}

shoppingList = JSON.parse(shoppingList)

async function addToCart(item, hasSubproduct=false) { //Subproduct is used for something like a jar of honey, where the jar is the subproduct and the honey is the item
    amountToAdd = parseFloat(document.getElementById(`Count of ${item}`).value)
    console.log(amountToAdd)
    amountToAdd = await setItemAmountToIncrement(item, amountToAdd)
    console.log(amountToAdd)
    
    if(hasSubproduct) { //if we have a subproduct, we need to add the subproduct to the shoppinglist and make sure the amount of the subproduct follows the increment of the item
        subProduct = document.getElementById(`Subproduct of ${item}`).value
        amountToAdd = await setItemAmountToIncrement(subProduct, amountToAdd)
    } else {
        subProduct = 0 //0 is the empty value for subproduct
    }
    
    for(i in shoppingList["Items"]) { //Look for the item if it is already in the shoppinglist.
        if(shoppingList["Items"][i]["productID"] == item && shoppingList["Items"][i]["subProductID"] == subProduct) {
            shoppingList["Items"][i]["amount"] += amountToAdd //Add the amount to the existing item in the shoppingList and return
            // checkout()
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
    // checkout()
}

function checkout() { //save the shoppinglist and go to the checkout
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}