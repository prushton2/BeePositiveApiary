dburl = "http://localhost:3000"

products = {
    "100": {
        "name"         :"Cuticle Salve",
        "price"        :4.99,
        "unit"         :"item",
        "description"  :""
    },
    "101": {
        "name"         :"Spa in a Jar",
        "price"        :2.99,
        "unit"         :"item",
        "description"  :"Spa"
    },
    "200": {
        "name"         :"Plain Honey",
        "price"        :4.99,
        "unit"         :"lb",
        "description"  : "Plain honey"
    },
    "201": {
        "name"         :"Cranberry Honey",
        "price"        :4.99,
        "unit"         :"lb",
        "description"  : "Cranberry flavored honey"
    }

}

dropdown = document.getElementById("cartButton")
cartContents = document.getElementById("cartButtonContents")
dropdown.addEventListener("mouseover", (e) => {
    html = ""
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(key in shoppingList["Items"]) {
        html += `<a href="#">${shoppingList["Items"][key]["amount"]} ${products[shoppingList["Items"][key]["productID"]]["name"]}`
    }
    cartContents.innerHTML = html
})

function getTotalCost(shoppingList) { // This function returns the precise int of the cost
    totalcost = 0;
    
    for(item in shoppingList) {
        item = shoppingList[item]
        totalcost += item["amount"] * (products[item["productID"]]["price"] * 100)
    }

    totalcost /= 100
    return totalcost
}

function getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9)
    return "$"+getTotalCost(shoppingList).toFixed(2)
}