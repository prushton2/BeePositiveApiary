itemsToDisplay = [ [ 100, 101 ] ]

setTimeout(async() => {

    allHTML = ""
    for (let i in itemsToDisplay) {
        i = itemsToDisplay[i]
        allHTML += await createHTML(i[0], "margin-left: 70px; margin-right: auto;")
        allHTML += await createHTML(i[1], "margin-left: auto; margin-right: 70px;")
    }

    document.getElementById("sec-b26f").innerHTML = `
    <div class="u-clearfix u-sheet u-sheet-1">
        <div class="u-list u-list-1">
            <div class="u-repeater u-repeater-1">
                ${allHTML}
            </div>
        </div>
    </div>
    `
}, 0)
  