import * as config from '../config.js';

window.handleCredentialResponse = handleCredentialResponse

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
    response = JSON.parse(await response.text())
    console.log(response)

    let authToken = response["response"]["authToken"]
    
    console.log(authToken)
    window.localStorage.setItem("auth", JSON.stringify(authToken))
}