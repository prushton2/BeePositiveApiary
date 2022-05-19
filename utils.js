//this script holds basic functions needed for any page to work
import * as config from '../config.js';
//Render the shoppinglist in the cart dropdown
let dropdown = document.getElementById("cartButton") 
dropdown.addEventListener("mouseover", async(e) => {
    let html = ""
    let shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(let key in shoppingList["Items"]) {

        html += products.createItemInfoString(shoppingList["Items"][key], `<a href="#">{amount}x {fullName}</a>`)
        // html += `<a href="#">${shoppingList["Items"][key]["amount"]}x ${subproduct}${(await products.getProduct(shoppingList["Items"][key]["productID"]))["name"]}`
    }
    document.getElementById("cartButtonContents").innerHTML = html
})


export function isMain(mainFileName) {
    return window.location.pathname.endsWith(mainFileName)
}


//cleaner http requests with automatic error handling (because im lazy)
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

//Manages the products and relations with subproducts
class Products {
    constructor() {
        this.MassTax = config.tax
        this.products = null
        this.productRelations = null
    }

    async getProducts(force=false) {
        if( (this.products == null || this.productRelations == null) || force ) {
            // console.log("Getting products from database")
            let response = JSON.parse(await fetch(`${config.dburl}/db/getProducts`).then((value) => {return value.text()}))
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
    //Get a products relation with a specific subproduct. Example: Get the price of a .5lb jar of honey
    getProductRelation(productId, subProductId) {
        for(let key in this.productRelations) {
            if(this.productRelations[key]["id"] == productId && this.productRelations[key]["subProductID"] == subProductId) {
                return this.productRelations[key]
            }
        }
    }
    //get all of a products relations with subproducts
    getProductRelations(productId) {
        let returnObject = []
        for(let key in this.productRelations) {
            if(this.productRelations[key]["id"] == productId) {
                returnObject.push(this.productRelations[key])
            }
        }
        return returnObject
    }
    //cost of an item
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

    createItemInfoString(item, formatString) { //item is a json object with the following keys: productID, subProductID, amount; where format String is a string that will be used to format how the item name appears
        // {productName}: name of the product
        // {subProductName}: name of the subproduct
        // {fullName}: name of the product and subproduct
        // {amount}: amount of the item
        // {price}: price of one item
        // {totalPrice}: total price of the item (amount * price)
        let productName     = this.getProduct(item["productID"])["name"]
        let subProductName  = this.getProduct(item["subProductID"])["name"]
        let fullName        = item["subProductID"] == 0 ? productName : `${ this.getProduct(item["subProductID"])["name"]} of ${productName}`
        let amount          = item["amount"]
        let price           = this.getItemCost(item["productID"], item["subProductID"], 1)
        let totalPrice      = this.getItemCost(item["productID"], item["subProductID"], item["amount"])

        formatString = formatString.replace("{productName}",    productName     )
        formatString = formatString.replace("{subProductName}", subProductName  )
        formatString = formatString.replace("{fullName}",       fullName        )
        formatString = formatString.replace("{amount}",         amount          )
        formatString = formatString.replace("{price}",          price           )
        formatString = formatString.replace("{totalPrice}",     totalPrice      )

        return formatString
    }

    // This function gives back a string that looks more like a price to the user ($4.90 instead of 4.9) aswell as the tax calculation
    getDisplayCost(shoppingList) { 
        let totalCost = this.getTotalCost(shoppingList)
        let taxedCost = totalCost + (this.MassTax * totalCost)
        return `\$${taxedCost.toFixed(2)}`
    }
    //This returns a display of the tax calculation being done without the total cost
    getTaxCalculation(shoppingList) { 
        let totalCost = this.getTotalCost(shoppingList)
        return `\$${totalCost.toFixed(2)} Subtotal <br>+ ${this.MassTax*100}% Tax`
    }
}

export let products = new Products()
//top level awaits are amazing
try {
    await products.getProducts()
} catch {
    alert("The server is not responding, please try again later")
}
