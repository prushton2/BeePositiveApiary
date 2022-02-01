shoppingList = JSON.parse(localStorage.getItem("shoppingList"))


function createHTML(item, count) {
    return `<div><div><label>${item["name"]}</label><br><label>${item["description"]}</label></div><div style='text-align: right;'><label>${item["price"]}</label>&nbsp&nbsp&nbspx<label>${count}</label></div></div><br>`
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

document.getElementById("sec-9fb3").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(shoppingList)}</div>`