shoppingList = []
function addToCart(item) {
    shoppingList.push(item)
}

function checkout() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "Checkout.html"
}