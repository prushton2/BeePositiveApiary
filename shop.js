try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {"Items":[]}
}
if(shoppingList == null) {
    shoppingList = {"Items":[]}
}
function addToCart(item) {
    amountToAdd = parseInt(document.getElementById(`Count of ${item}`).value)

    if(amountToAdd <= 0) { //prevent insertion of negative quantities
        amountToAdd = 0
    }

    for(i in shoppingList["Items"]) { //Find if order exists already and add to it
        if(shoppingList["Items"][i]["productID"] == item) {
            shoppingList["Items"][i]["amount"] += amountToAdd
            checkout()
            return;
        }
    }
    shoppingList["Items"].push( {
        "productID": item,
        "amount": amountToAdd
    })
    checkout()
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}