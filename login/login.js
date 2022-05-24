
let user
window.handleCredentialResponse = handleCredentialResponse
window.googleUser = getUser()

export function handleCredentialResponse(googleUser) {
    console.log(googleUser)
    user = googleUser
    // var profile = googleUser.getBasicProfile();
    console.log(`ID: ${googleUser.getId()}`)
    console.log(`Name: ${googleUser.getName()}`)
    console.log(`Image URL: ${googleUser.getImageUrl()}`)
    console.log(`Email: ${googleUser.getEmail()}`)
}

export function getUser() {
    return googleUser
}