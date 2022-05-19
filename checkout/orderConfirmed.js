import * as utils from "../utils.js"
import * as config from "../config.js"
window.utils = utils

//get the url parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const viewKey = urlParams.get('viewKey');

async function createHTML(item) { //shoppingList[item], supposed to contain amount and subproductID
    let htmlString = `<div> <label>{fullName}</label><div style='float:right; text-align: right;'>{price}&nbsp&nbsp&nbspx{amount} &nbsp&nbsp&nbsp (\${totalPrice})</div></div><br>`
    return utils.products.createItemInfoString(item, htmlString)
}

const orderInfo = await utils.httpRequest(`${config.dburl}/orders/getByKey`, "POST", {
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

for(let key in orderInfo["response"]["purchases"]) {
    html += await createHTML(orderInfo["response"]["purchases"][key])
}
document.getElementById("CheckoutList").innerHTML = html

document.getElementById("totalCost").innerHTML = `${utils.products.getTaxCalculation(orderInfo["response"]["purchases"])}<br>Total: ${utils.products.getDisplayCost(orderInfo["response"]["purchases"])}`
