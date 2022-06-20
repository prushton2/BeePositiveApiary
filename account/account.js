import * as config from "../config.js";
import * as utils from "../utils.js"

window.signOut = signOut

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


export async function signOut() {
    await utils.httpRequest(`${config.dburl}/auth/logout`, "POST", null, true)
    window.location.reload()
}