try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {}
}
if(shoppingList == null) {
    shoppingList = {}
}
function addToCart(item) {
    try {
        if(shoppingList[item] == undefined) {
            shoppingList[item] = 1;
        } else {
            shoppingList[item] += 1;
        }
    } catch {
        shoppingList[item] = 1;
    }
    checkout()
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "Checkout.html"
}