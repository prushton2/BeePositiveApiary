import * as config from '../config.js';
import * as utils from '../utils.js';

window.loginWithGoogle = loginWithGoogle
window.callback = callback
window.signOut = signOut


// globalThis.handleCredentialResponse = handleCredentialResponse
async function callback(response) {
    console.log(response)
}

async function loginWithGoogle(googleUser) {
    console.log("sending credentials to server")

    await utils.httpRequest(`${config.dburl}/auth/google/login`, "POST", 
    {
        "JWT": googleUser["credential"],
    }, false)
    
    window.location.reload()
}

export async function signOut() {

    let response = await utils.httpRequest(`${config.dburl}/auth/logout`, "POST", {}, true)
    console.log(await response.text())
    window.location.reload()
}