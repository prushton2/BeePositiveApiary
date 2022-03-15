buy = async() => {

    //Make this into a loop
    if(document.getElementById("name").value) { 
        username = document.getElementById("name").value
    } else {
        document.getElementById("response").innerHTML = "Please enter your name"
        return;
    }
    
    if(document.getElementById("email").value) {
        email = document.getElementById("email").value
    } else {
        document.getElementById("response").innerHTML = "Please enter your email"
        return;
    }

    if(document.getElementById("phone").value) { 
        phone = document.getElementById("phone").value
    } else {
        document.getElementById("response").innerHTML = "Please enter your phone number"
        return;
    }

    if(document.getElementById("address").value) { 
        address = document.getElementById("address").value
    } else {
        document.getElementById("response").innerHTML = "Please enter your name"
        return;
    }

    shoppingList = JSON.parse(localStorage.getItem("shoppingList")) // needs to stay as a string

    response = await fetch(`${dburl}/add`, 
        {method: "POST", headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            "Order": {
                "name": username,
                "address": address,
                "email": email,
                "phoneNumber": phone
            },
            "Items": shoppingList["Items"]
        })})

    if(response.status == "200") {
        document.getElementById("response").innerHTML = `Order has been placed!`
    } else {
        document.getElementById("response").innerHTML = "There was an error placing your order."
    }
    
    localStorage.removeItem("shoppingList")
}