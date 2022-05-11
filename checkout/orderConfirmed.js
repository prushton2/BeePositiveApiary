//get the url parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const viewKey = urlParams.get('viewKey');


async function createHTML(item) { //shoppingList[item], supposed to contain amount and subproductID
    let subProductLabel = item["subProductID"] == 0 ? "" : `${ (await products.getProduct(item["subProductID"]))["name"]} of`
    let label = `<label>${subProductLabel} ${(await products.getProduct(item["productID"]))["name"]}</label>`
    let price = `<label>$${ await products.getItemCost(item["productID"], item["subProductID"], 1) }</label>&nbsp&nbsp&nbsp`

    return `<div>${label}<div style='float:right; text-align: right;'>${price}x${item["amount"]}</div></div><br>`
}

setTimeout(async() => {

    console.log(orderId);
    console.log(viewKey);

    const orderInfo = await httpRequest(`${dburl}/getSpecificOrder`, "POST", {
        "orderID": parseInt(orderId),
        "viewKey": viewKey
    }, false)
    console.log(orderInfo)

    document.getElementById("orderNumber").innerHTML = `Order #${orderInfo["response"]["order"]["id"]}`;
    document.getElementById("name").innerHTML = orderInfo["response"]["order"]["name"];
    document.getElementById("address").innerHTML = orderInfo["response"]["order"]["address"];
    document.getElementById("phoneNumber").innerHTML = orderInfo["response"]["order"]["phoneNumber"];
    document.getElementById("email").innerHTML = orderInfo["response"]["order"]["email"];
    document.getElementById("status").innerHTML = orderInfo["response"]["order"]["isComplete"] ? "Completed" : "Incomplete";

    let html = ""
    for(var key in orderInfo["response"]["purchases"]) {
        html += await createHTML(orderInfo["response"]["purchases"][key])
    }
    document.getElementById("CheckoutList").innerHTML = html

    document.getElementById("totalCost").innerHTML = `${await products.getTaxCalculation(orderInfo["response"]["purchases"])}<br>Total: ${await products.getDisplayCost(orderInfo["response"]["purchases"])}`

}, 0)