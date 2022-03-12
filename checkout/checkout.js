shoppingList = JSON.parse(localStorage.getItem("shoppingList"))


function createHTML(item, count) {
    return `<div><div><label>${item["name"]}</label><br><label>${item["description"]}</label></div><div style='text-align: right;'><label>$${item["price"]}</label>&nbsp&nbsp&nbspx<input onchange="updateShoppingList()" id="Count of ${item["name"]}" value=${count}></div></div><br>`
}

function createAllHtml(jsonobject) {
    html = ""

    for(var key in jsonobject) {
        html += createHTML(products[key], jsonobject[key])
    }
    return html
}

function gotofinalize() {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    window.location.href = "finalize.html"
}

function updateShoppingList() {
    for(var key in shoppingList) {
        shoppingList[key] = parseInt(document.getElementById(`Count of ${key}`).value)
    }
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList))
    document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList)}`
}

document.getElementById("sec-9fb3").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`
document.getElementById("totalCost").innerHTML = `${getDisplayCost(shoppingList)}`