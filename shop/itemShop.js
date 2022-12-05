import * as shop from './shop.js';
import * as utils from '../utils.js';

let itemsToDisplay = utils.products.getProductsByLocation("items");

document.getElementById("sec-b26f").innerHTML = await shop.createAllHTML(itemsToDisplay)

shop.addEventListeners(itemsToDisplay)