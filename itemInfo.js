dburl = "http://localhost:3000"
MassTax = 0.0625
products = {
    "100": {
        "name"         :"Cuticle Salve",
        "price"        :4.99,
        "unit"         :"item",
        "description"  :"",
        "increment"    :1
    },
    "101": {
        "name"         :"Spa in a Jar",
        "price"        :2.99,
        "unit"         :"item",
        "description"  :"Spa",
        "increment"    :1
    },
    "200": {
        "name"         :"Plain Honey",
        "price"        :4.99,
        "unit"         :"lb",
        "description"  :"Plain honey",
        "increment"    :.5
    },
    "201": {
        "name"         :"Cranberry Honey",
        "price"        :5.49,
        "unit"         :"lb",
        "description"  :"Cranberry flavored honey",
        "increment"    :.5
    }

}

dropdown = document.getElementById("cartButton") //Render the shoppinglist in the cart dropdown
cartContents = document.getElementById("cartButtonContents")
dropdown.addEventListener("mouseover", (e) => {
    html = ""
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(key in shoppingList["Items"]) {
        html += `<a href="#">${shoppingList["Items"][key]["amount"]} ${products[shoppingList["Items"][key]["productID"]]["name"]}`
    }
    cartContents.innerHTML = html
})

function getTotalCost(shoppingList) { // This function returns the precise int of the cost of the given shoppinglist as well as the tax
    totalcost = 0;
    
    for(item in shoppingList) {
        item = shoppingList[item]
        totalcost += item["amount"] * (products[item["productID"]]["price"] * 100)
    }

    totalcost /= 100
    return totalcost
}

function setItemAmountToIncrement(itemID, amount) {

    amount = amount <= 0 ? 0 : amount // remove negative numbers

    if(products[itemID]["increment"] != 0) { // if the increment isnt 0, then make the number conform to the increment
        return (amount - (amount % products[itemID]["increment"]))
    }
    return amount
}

function getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9) aswell as the tax calculation
    totalCost = getTotalCost(shoppingList)
    taxedCost = totalCost + (MassTax * totalcost)
    
    return "$"+taxedCost.toFixed(2)
}

function getTaxCalculation(shoppingList) { //This returns a display of the tax calculation being done without the total cost
    totalCost = getTotalCost(shoppingList)
    taxedCost = totalCost + (MassTax * totalcost)
    return `\$${totalCost.toFixed(2)} Subtotal <br>+ ${MassTax}% Tax`
}