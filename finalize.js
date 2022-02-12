buy = async() => {

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

    shoppingList = localStorage.getItem("shoppingList") // needs to stay as a string
    response = await fetch(`${dburl}add/${shoppingList}/${Date.now()}/${email}/${username}`).then(value => {return value.text()})
    response = JSON.parse(response)
    if(response["status"] == "200") {
        document.getElementById("response").innerHTML = "Order has been placed!"
    } else {
        document.getElementById("There was an error placing your order.")
    }
    
    localStorage.setItem("shoppingList", "{}")
}