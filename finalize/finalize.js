buy = async() => {
    textboxes = ["name", "address", "email", "phoneNumber"]
    Order = {}

    // {
    //     "name": username,
    //     "address": address,
    //     "email": email,
    //     "phoneNumber": phone
    // }
    //Make this into a loop

    textboxes.forEach(element => {
        if(document.getElementById(element).value) {//if not empty
            Order[element] = document.getElementById(element).value
        } else {
            document.getElementById("response").innerHTML = "Please fill in all the textboxes"
            return
        }
    });

    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

    response = await httpRequest(`${dburl}/add`, "POST", {
        "Order": Order,
        "Items": shoppingList["Items"]
    }, true)

    if(response["response"] == "Invalid input") {
        document.getElementById("response").innerHTML = "There was an error placing your order."
    } else {
        document.getElementById("response").innerHTML = `Order has been placed!`
    }
    
    localStorage.removeItem("shoppingList")
}