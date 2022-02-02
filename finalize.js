function buy() {
    dburl = "https://database.beepositiveapiary.com/"
    username = document.getElementById("name").value
    email = document.getElementById("email").value
    shoppingList = localStorage.getItem("shoppingList") // needs to stay as a string
    getURLWithoutCors(`${dburl}add/${shoppingList}/${Date.now()}/${email}/${username}`)
    document.getElementById("response").innerHTML = "Order has been placed!"
    localStorage.setItem("shoppingList", "{}")
}