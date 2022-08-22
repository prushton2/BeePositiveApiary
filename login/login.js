import * as config from '../config.js';
import * as utils from '../utils.js';

window.loginWithGoogle = loginWithGoogle
window.signOut = signOut


async function loginWithGoogle(googleUser) {
    console.log("sending credentials to server")

    await utils.httpRequest(`${config.dburl}/auth/google/login`, "POST", 
    {
        "JWT": googleUser["credential"],
    }, false)
    
    window.location.reload()
}

export async function signOut() {
    await utils.httpRequest(`${config.dburl}/auth/logout`, "GET", undefined, true)
    window.location.reload()
}