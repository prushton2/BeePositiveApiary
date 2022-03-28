dburl = "http://localhost:3000"
MassTax = 0.0625

class Products {
    constructor() {
        this.products = {}
    }

    async getProducts() {
        response = await httpRequest(`${dburl}/products`, "GET", {}, true)
        this.products = response["products"]
    }
    //gets product from the database with the given name
     getProduct(productID) {
    
        for(key in products) {
            if(products[key]["id"] == productID) {
                return products[key]
            }
        }
    
    }
    
    async getTotalCost(shoppingList) { // This function returns the precise int of the cost of the given shoppinglist as well as the tax
        products = await getProducts()
        totalcost = 0;
        
        console.log(products)
        
        for(item in shoppingList) {
            item = shoppingList[item]
            totalcost += item["amount"] * (getProduct(item["productID"])["price"] * 100)
        }

        totalcost /= 100
        return totalcost
    }

    async setItemAmountToIncrement(itemID, amount) {
        products = await getProducts()
        amount = Math.max(amount, 0) //remove negative numbers
        console.log(products)
        console.log(getProduct(products))
        console.log(getProduct(products)["increment"])

        if(getProduct(products[itemID])["increment"] != 0) { // if the increment isnt 0, then make the number conform to the increment
            return (amount - (amount % getProduct(products[itemID])["increment"]))
        }
        return amount
    }

    async getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9) aswell as the tax calculation
        totalCost = await getTotalCost(shoppingList)
        taxedCost = totalCost + (MassTax * totalcost)
        
        return "$"+taxedCost.toFixed(2)
    }

    async getTaxCalculation(shoppingList) { //This returns a display of the tax calculation being done without the total cost
        totalCost = await getTotalCost(shoppingList)
        taxedCost = totalCost + (MassTax * totalcost)
        return `\$${taxedCost.toFixed(2)} Subtotal <br>+ ${MassTax*100}% Tax`
    }
}

products = new Products()