import * as shop from './shop.js';

let itemsToDisplay = [[200, 201]]

document.getElementById("sec-b26f").innerHTML = await shop.createAllHTML(itemsToDisplay)

shop.addEventListeners(itemsToDisplay)
