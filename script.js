//this script holds basic functions needed for any page to work

dropdown = document.getElementById("cartButton") //Render the shoppinglist in the cart dropdown
cartContents = document.getElementById("cartButtonContents")
dropdown.addEventListener("mouseover", async(e) => {
    await products.getProducts()
    html = ""
    shoppingList = JSON.parse(localStorage.getItem("shoppingList"))
    for(key in shoppingList["Items"]) {
        html += `<a href="#">${shoppingList["Items"][key]["amount"]} ${products.getProduct(shoppingList["Items"][key]["productID"])["name"]}`
    }
    cartContents.innerHTML = html
})


//cleaner http requests with automatic error handling
async function httpRequest(url, method, body, makeAlertOnError) {

    response = await fetch(url, {
        method: method, headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    
    if(response.status >= 200 && response.status < 300) {
        text = await response.text()
        return JSON.parse(text)
    } else {
        if(makeAlertOnError) {
            alert("There was an error making your request")
        }
        text = await response.text()
        return JSON.parse(text)
    }
}