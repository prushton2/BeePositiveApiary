itemsToDisplay = [100, 101]


allHTML = ""
for (i in itemsToDisplay) {
    allHTML += await Promise.resolve(createHTML(100))
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
