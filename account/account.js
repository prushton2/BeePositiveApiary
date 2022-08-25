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
let orders = await utils.httpRequest(`${config.dburl}/orders/getPlacedOrders`, "GET", null, false)
console.log(orders)

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