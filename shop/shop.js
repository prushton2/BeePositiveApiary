try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {"Items":[]}
}
if(shoppingList == null) {
    shoppingList = {"Items":[]}
}
function addToCart(item) {
    amountToAdd = document.getElementById(`Count of ${item}`)
    for(i in shoppingList["Items"]) {
        if(shoppingList["Items"][i]["productID"] == item) {
            shoppingList["Items"][i]["amount"] += parseInt(amountToAdd.value)
            checkout()
            return;
        }
    }
    shoppingList["Items"].push( {
        "productID": item,
        "amount": parseInt(amountToAdd.value)
    })
    checkout()
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "../checkout/Checkout.html"
}