import * as shop from './shop.js';

let itemsToDisplay = [[100, 101]]

document.getElementById("sec-b26f").innerHTML = await shop.createAllHTML(itemsToDisplay)

shop.addEventListeners(itemsToDisplay)

  