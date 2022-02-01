function buy() {
    dburl = "https://database.beepositiveapiary.com/"
    username = document.getElementById("name").value
    email = document.getElementById("email").value
    shoppingList = localStorage.getItem("shoppinglist")
    getURLWithoutCors(`${dburl}add/${shoppingList}/${Date.now()}/${email}/${username}`)
    document.getElementById("response").innerHTML = "Order has been placed!"
}