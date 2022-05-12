import * as config from '../config.js';

// dburl = config.dburl
class Products {
    constructor() {
        this.MassTax = config.tax
        this.products = null
        this.productRelations = null
    }

    async getProducts() {
        if(this.products == null || this.productRelations == null) {
            let response = JSON.parse(await fetch(`${config.dburl}/getProducts`).then((value) => {return value.text()}))
            this.products = response["response"]["products"]
            this.productRelations = response["response"]["productRelations"]
        }
    }

    //gets product from the database with the given name
    async getProduct(productID) {
        await this.getProducts()
        for(let key in this.products) {
            if(this.products[key]["id"] == productID) {
                return this.products[key]
            }
        }
    }

    async getProductRelation(productId, subProductId) {
        await this.getProducts()
        for(let key in this.productRelations) {
            if(this.productRelations[key]["productId"] == productId && this.productRelations[key]["subProductId"] == subProductId) {
                return this.productRelations[key]
            }
        }
    }

    async getProductRelations(productId) {
        await this.getProducts()
        let returnObject = []
        for(let key in this.productRelations) {
            if(this.productRelations[key]["productId"] == productId) {
                returnObject.push(this.productRelations[key])
            }
        }
        return returnObject
    }

    async getItemCost(productId, subProductId, amount) {
        await this.getProducts()
        return (await this.getProductRelation(productId, subProductId))["price"] * amount
    }

    async getTotalCost(shoppingList) { // This function returns the precise int of the cost of the given shoppinglist as well as the tax
        await this.getProducts()
        let totalcost = 0;
                
        for(let item in shoppingList) {
            item = shoppingList[item]

            let itemCost = await this.getItemCost(item["productID"], item["subProductID"], item["amount"]) * 100
            totalcost += itemCost
        }

        totalcost /= 100
        return totalcost
    }

    async setItemAmountToIncrement(itemID, amount) {
        // await this.getProducts()
        // amount = Math.max(amount, 0) //remove negative numbers
        
        // if(this.getProduct(itemID)["increment"] != 0) { // if the increment isnt 0, then make the number conform to the increment
        //     return (amount - (amount % this.getProduct(itemID)["increment"]))
        // }
        return amount - amount%1
    }

    async getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9) aswell as the tax calculation
        let totalCost = await this.getTotalCost(shoppingList)
        let taxedCost = totalCost + (this.MassTax * totalCost)
        return `\$${taxedCost.toFixed(2)}`
    }

    async getTaxCalculation(shoppingList) { //This returns a display of the tax calculation being done without the total cost
        let totalCost = await this.getTotalCost(shoppingList)
        return `\$${totalCost.toFixed(2)} Subtotal <br>+ ${this.MassTax*100}% Tax`
    }
}

export let products = new Products()