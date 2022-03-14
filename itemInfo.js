dburl = "http://localhost:3000"

products = {
    "0": {
        "name"         :"Cuticle Salve",
        "price"        :4.99,
        "unit"         :"item",
        "description"  :""
    },
    "1": {
        "name"         :"Spa in a Jar",
        "price"        :2.99,
        "unit"         :"item",
        "description"  :"Spa"
    }

}

function convertSQLtoShoppingList(sql) { //This turns the SQL json response from the purchases table into a shoppinglist
    shoppingList = {}
    for(key in sql) {
        shoppingList[sql[key]["orderID"]] = sql[key]["amount"]
    }
    return shoppingList
}

function getTotalCost(shoppingList) { // This function returns the precise int of the cost
    totalcost = 0;
    for (var item in shoppingList) {
        amount = shoppingList[item]
        item = products[item]
        totalcost += amount * (item["price"] * 100)
    }
    totalcost /= 100
    return totalcost
}

function getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9)
    return "$"+getTotalCost(shoppingList).toFixed(2)
}