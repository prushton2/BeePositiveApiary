//this script holds basic functions needed for any page to work, also requires the itemInfo.js file
import * as config from '../config.js';

let dropdown = document.getElementById("cartButton") //Render the shoppinglist in the cart dropdown
let cartContents = document.getElementById("cartButtonContents")
dropdown.addEventListener("mouseover", async(e) => {
    await products.getProducts()
    let html = ""
    let shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(let key in shoppingList["Items"]) {
        let subproduct = shoppingList["Items"][key]["subProductID"] == 0 ? "" : `${(await products.getProduct(shoppingList["Items"][key]["subProductID"]))["name"]} of `
        html += `<a href="#">${shoppingList["Items"][key]["amount"]}x ${subproduct}${(await products.getProduct(shoppingList["Items"][key]["productID"]))["name"]}`
    }
    cartContents.innerHTML = html
})


//cleaner http requests with automatic error handling
export async function httpRequest(url, method, body, makeAlertOnError) {

    let response = await fetch(url, {
        method: method, headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    
    if(response.status >= 200 && response.status < 300) {
        let text = await response.text()
        return JSON.parse(text)
    } else {
        if(makeAlertOnError) {
            alert("There was an error making your request")
        }
        let text = await response.text()
        return JSON.parse(text)
    }
}

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
    getProduct(productID) {
        for(let key in this.products) {
            if(this.products[key]["id"] == productID) {
                return this.products[key]
            }
        }
    }

    getProductRelation(productId, subProductId) {
        for(let key in this.productRelations) {
            if(this.productRelations[key]["productId"] == productId && this.productRelations[key]["subProductId"] == subProductId) {
                return this.productRelations[key]
            }
        }
    }

    getProductRelations(productId) {
        let returnObject = []
        for(let key in this.productRelations) {
            if(this.productRelations[key]["productId"] == productId) {
                returnObject.push(this.productRelations[key])
            }
        }
        return returnObject
    }

    getItemCost(productId, subProductId, amount) {
        return (this.getProductRelation(productId, subProductId)["price"] * amount).toFixed(2)
    }

    getTotalCost(shoppingList) { // This function returns the precise int of the cost of the given shoppinglist as well as the tax
        let totalcost = 0;
                
        for(let item in shoppingList) {
            item = shoppingList[item]

            let itemCost = this.getItemCost(item["productID"], item["subProductID"], item["amount"]) * 100
            totalcost += itemCost
        }

        totalcost /= 100
        return totalcost
    }

    createItemNameString(item, formatString) { //item is a json object with the following keys: productID, subProductID, amount; where format String is a string that will be used to format how the item name appears
        // {name}: item name
        // {amount}: amount of the item
        // {price}: price of one item
        // {totalPrice}: total price of the item (amount * price)
        // {subProductName}: name of the subproduct
        // {productName}: name of the product and subproduct
        let name = this.getProduct(item["productID"])["name"]
        let amount = item["amount"]
        let price = this.getItemCost(item["productID"], item["subProductID"], 1)
        let totalPrice = this.getItemCost(item["productID"], item["subProductID"], item["amount"])
        let subProductName = this.getProduct(item["subProductID"])["name"]
        let productName = item["subProductID"] == 0 ? name : `${ this.getProduct(item["subProductID"])["name"]} of ${name}`

        formatString = formatString.replace("{name}", name).replace("{amount}", amount).replace("{subProductName}", subProductName).replace("{productName}", productName).replace("{price}", price).replace("{totalPrice}", totalPrice)
        return formatString
    }

    setItemAmountToIncrement(itemID, amount) { //going to be deprecated
        return amount - amount%1
    }

    getDisplayCost(shoppingList) { // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9) aswell as the tax calculation
        let totalCost = this.getTotalCost(shoppingList)
        let taxedCost = totalCost + (this.MassTax * totalCost)
        return `\$${taxedCost.toFixed(2)}`
    }

    getTaxCalculation(shoppingList) { //This returns a display of the tax calculation being done without the total cost
        let totalCost = this.getTotalCost(shoppingList)
        return `\$${totalCost.toFixed(2)} Subtotal <br>+ ${this.MassTax*100}% Tax`
    }
}

export let products = new Products()
await products.getProducts()
