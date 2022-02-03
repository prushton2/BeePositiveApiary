function buy() {
    dburl = "https://database.beepositiveapiary.com/"

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
    fetch(`${dburl}add/${shoppingList}/${Date.now()}/${email}/${username}`)
    document.getElementById("response").innerHTML = "Order has been placed!"
    localStorage.setItem("shoppingList", "{}")
}