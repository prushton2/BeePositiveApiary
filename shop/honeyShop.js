itemsToDisplay = [[100, 101], [200, 201]]

setTimeout(async() => {
    
    allHTML = ""
    for (let i in itemsToDisplay) {
        j = i
        i = itemsToDisplay[i]
        allHTML += await createHTML(i[0], `position: absolute; left: 105px; margin-top: ${50 + (j*450)}px;`)
        allHTML += await createHTML(i[1], `position: absolute; right: 105px; margin-top: ${50 + (j*450)}px;`)
        allHTML += "<br>"
    }

    document.getElementById("sec-b26f").innerHTML = `
    ${allHTML}`/*
    <div class="u-clearfix u-sheet u-sheet-1">
        <div class="u-list u-list-1">
            <div class="u-repeater u-repeater-1">
            </div>
        </div>
    </div>
    `*/
}, 0)
  