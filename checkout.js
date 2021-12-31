shoppingList = JSON.parse(localStorage.getItem("shoppingList"))

function getOccurrence(array, value) {
    count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

function createHTML(item, count) {
    return `<div><div><label>${item["name"]}</label><br><label>${item["description"]}</label></div><div style='text-align: right;'><label>${item["price"]}</label>&nbsp&nbsp&nbspx<label>${count}</label></div></div><br>`
}

function createAllHtml(array) {
    html = ""
    array.forEach((element) => {
        html += createHTML(products[element[0]], element[1])
    })
    return html
}

usedItems = []
countArray = []
shoppingList.forEach((element) => {
    if(usedItems.indexOf(element) == -1) {
        countArray.push([element, getOccurrence(shoppingList, element)])
        usedItems.push(element)
    }
})

document.getElementById("sec-9fb3").innerHTML = `<div class="u-clearfix u-sheet u-sheet-1">${createAllHtml(countArray)}</div>`