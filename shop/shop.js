try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {"Items":[]}
}
if(shoppingList == null) {
    shoppingList = {"Items":[]}
}
function addToCart(item) {
    for(i in shoppingList["Items"]) {
        if(shoppingList["Items"][i]["productID"] == item) {
            shoppingList["Items"][i]["amount"] += 1;
            checkout()
            return;
        }
    }
    shoppingList["Items"].push( {
        "productID": item,
        "amount": 1
    })
    checkout()
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}