import * as config from "../config.js";
import * as utils from "../utils.js"

window.signOut = signOut
window.deleteAccount = deleteAccount

//redirect to login if the user doesnt have a token

let user = await utils.httpRequest(`${config.dburl}/auth/getUser`, "GET", null, false, true)

if(user.response.status != 200) {
    utils.goto("login")
}


//load the user info
document.getElementById("name").innerHTML =           ` ${user.text.response.name}`
document.getElementById("email").innerHTML =          ` ${user.text.response.email}`
document.getElementById("authentication").innerHTML = ` ${user.text.response.authType}`
document.getElementById("accountType").innerHTML =    ` ${user.text.response.permissions}`

//load the user's orders
let orders = (await utils.httpRequest(`${config.dburl}/orders/getPlacedOrders`, "GET", null, false))["response"]

function createOrderItemString(element) {
    let date = new Date(element["date"])
    return `<a href="${config.thisURL}/checkout/OrderConfirmed.html?orderId=${element["id"]}&viewKey=loggedInUser">Order #${element["id"]}: ${ (date.toString()).split(" ").splice(1, 4).join(" ") } (${element["isComplete"] ? "complete" : "incomplete"})</a>`
}

orders["active"] = orders["active"].map(element => createOrderItemString(element))

orders["completed"] = orders["completed"].map(element => createOrderItemString(element))


document.getElementById("orderListBox").innerHTML = `<b>Active Orders</b><br>${orders["active"]}<br><b>Past Orders</b><br>${orders["completed"]}`


//------------------------
export async function signOut() {
    await utils.httpRequest(`${config.dburl}/auth/logout`, "GET", undefined, true)
    window.location.reload()
}

async function deleteAccount() {
    if(!confirm("Are you sure you want to delete your account?")) {
        return
    }
    let response = await utils.httpRequest(`${config.dburl}/auth/deleteAccount`, "POST", null, false, true)
    if(response.response.status == 301) {
        alert("Please sign in again and try again.")
    } else {
        alert("Account deleted.")
    }
    utils.goto("login")
}

document.getElementById("extraOptionsBox").innerHTML = `<a href="${user.text.extraMenuItems[0][0]}" class="u-btn u-btn-round u-button-style u-hover-palette-1-light-1 u-palette-1-base u-radius-50 u-btn-1">${user.text.extraMenuItems[0][1]}</button>`