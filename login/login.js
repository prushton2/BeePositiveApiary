import * as config from '../config.js';

window.handleCredentialResponse = handleCredentialResponse
window.signOut = signOut

export async function handleCredentialResponse(googleUser) {

    let response = await fetch(`${config.dburl}/auth/login`, {
        method: "POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            "JWT": googleUser["credential"],
            "oldSession": JSON.parse(window.localStorage.getItem("auth"))
        })
    })
    response = JSON.parse(await response.text())

    let authToken = response["response"]["authToken"]
    
    window.localStorage.setItem("auth", JSON.stringify(authToken))
    window.location.reload()
}

export async function signOut() {
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await fetch(`${config.dburl}/auth/logout`, {
        method: "POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            "auth": JSON.parse(window.localStorage.getItem("auth"))
        })
    })
    window.localStorage.removeItem("auth")
    window.location.reload()
}