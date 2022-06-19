import * as config from '../config.js';
import * as utils from '../utils.js';

window.handleCredentialResponse = handleCredentialResponse
window.callback = callback
window.signOut = signOut


// globalThis.handleCredentialResponse = handleCredentialResponse
async function callback(response) {
    console.log(response)
}

async function handleCredentialResponse(googleUser) {
    console.log("sending credentials to server")

    await utils.httpRequest(`${config.dburl}/auth/google/login`, "POST", 
    {
        "JWT": googleUser["credential"],
    }, false)
    
    window.location.reload()
}

export async function signOut() {

    let response = await utils.httpRequest(`${config.dburl}/auth/logout`, "POST", {}, true)
            
    document.cookie = "auth= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.reload()
    }