itemsToDisplay = [[200, 201]]

setTimeout(async() => {
    
    allHTML = ""
    for (let i in itemsToDisplay) {
        j = i
        i = itemsToDisplay[i]
        allHTML += await createHTML(i[0], `position: absolute; left:  20%; margin-top: ${50 + (j*450)}px;`)
        allHTML += await createHTML(i[1], `position: absolute; right: 20%; margin-top: ${50 + (j*450)}px;`)
        allHTML += "<br>"
    }

    document.getElementById("sec-b26f").innerHTML = `${allHTML}`
}, 0)
  