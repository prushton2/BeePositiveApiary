import * as utils from "../utils.js"
import * as config from "../config.js"
import * as checkout from "./checkout.js"

export async function buy() {
    let textboxes = ["name", "address", "email", "phoneNumber"] // the textboxes that are required
    let Order = {} 
    
    textboxes.forEach(element => { //go over each textbox
        if(document.getElementById(element).value) {//if not empty
            Order[element] = document.getElementById(element).value //add it to the order
        } else {
            document.getElementById("response").innerHTML = "Please fill in all the textboxes" //if empty, tell the user to fill in all the textboxes
            return 
        }
    });

    let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) //get the shoppinglist

    let response = await utils.httpRequest(`${config.dburl}/add`, "POST", { //send the post request to the database to add the order
        "wantsToReceiveEmails": document.getElementById("sendEmail").checked,
        "Order": Order,
        "Items": shoppingList["Items"]
    }, true)

    if(response["response"] != "Order Created") { //if the response is invalid input
        document.getElementById("response").innerHTML = response["response"] //tell them there was an error
    } else {
        document.getElementById("response").innerHTML = `Order has been placed!` //if the response is valid, tell them the order has been placed
        localStorage.removeItem("shoppingList") //delete the shoppinglist to prevent duplicate orders
        window.location.href = `orderConfirmed.html?orderId=${response["orderID"]}&viewKey=${response["viewKey"]}` //redirect to the order confirmed page
    }
}

if(utils.isMain("Finalize.html")) {
    document.getElementById("PlaceorderButton").addEventListener("click", buy) //when the place order button is clicked, run the buy function
    checkout.drawCheckout("CheckoutList", "totalCost")
    document.getElementById("resetShoppingCart").addEventListener("click", checkout.resetShoppingCart )
}