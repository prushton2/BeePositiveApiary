try {
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
} catch {
    shoppingList = {}
}
function addToCart(item) {
    if(shoppingList[item] == undefined) {
        shoppingList[item] = 1;
    } else {
        shoppingList[item] += 1;
    }
    checkout()
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "Checkout.html"
}