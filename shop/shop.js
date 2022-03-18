// Requires itemInfo.js

try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {"Items":[]}
}

if(shoppingList["Items"] == null || undefined) {
    shoppingList = {"Items":[]}
}

function addToCart(item) {
    amountToAdd = parseFloat(document.getElementById(`Count of ${item}`).value)

    amountToAdd = setItemAmountToIncrement(item, amountToAdd)

    for(i in shoppingList["Items"]) { //Look for the item if it is already in the shoppinglist.
        if(shoppingList["Items"][i]["productID"] == item) {
            shoppingList["Items"][i]["amount"] += amountToAdd //Add the amount to the existing item in the shoppingList and return
            checkout()
            return;
        }
    }
    try {
        // Create a new entry for the item in the shoppinglist if there isnt an entry already
        shoppingList["Items"].push( {
            "productID": item,
            "amount": amountToAdd
        })
    } catch {
        if(confirm("There was an error adding items to your cart. Press Ok to clear your cart")) {
            localStorage.setItem("shoppingList", '{"Items":[]}')
            shoppingList = {"Items":[]}
            alert("Your cart is cleared. Try adding the items again")
        }
        return
    }
    checkout()
}

function checkout() { //save the shoppinglist and go to the checkout
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}