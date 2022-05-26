import * as config from '../config.js';

let user
window.handleCredentialResponse = handleCredentialResponse
window.googleUser = getUser()

export async function handleCredentialResponse(googleUser) {
    console.log(googleUser)
    console.log(googleUser["credential"])

    let response = await fetch(`${config.dburl}/auth/login`, {
        method: "POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({
            "JWT": googleUser["credential"]
        })
    })
    response = await response.text()
    console.log(response)

}

export function getUser() {
    return googleUser
}