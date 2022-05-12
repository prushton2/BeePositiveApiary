import * as shop from './shop.js';
let itemsToDisplay = [[200, 201]]

setTimeout(async() => {
    
    let allHTML = ""
    for (let i in itemsToDisplay) {
        let j = i
        i = itemsToDisplay[i]
        allHTML += await shop.createHTML(i[0], `position: absolute; left:  20%; margin-top: ${50 + (j*450)}px;`)
        allHTML += await shop.createHTML(i[1], `position: absolute; right: 20%; margin-top: ${50 + (j*450)}px;`)
        allHTML += "<br>"
    }

    document.getElementById("sec-b26f").innerHTML = `${allHTML}`
}, 0)
  