import * as utils from "../utils.js"
import * as config from "../config.js"

export let loadedDBName = ""
export let loadedDB

let authToken = JSON.parse(window.localStorage.getItem("auth"))

window.loadDB = loadDB
window.saveEdit = saveEdit
window.queueEdit = saveEdit
window.deleteEntry = deleteEntry
window.newEntry = newEntry
window.getJson = getJson

export async function loadDB(name) {

    let primaryKeyColumns

    await utils.products.getProducts(true)

    switch(name) {
        case "Products":
            loadedDBName = "Products"
            loadedDB = utils.products.products
            primaryKeyColumns = ["id"]
            break
        case "ProductRelations":
            loadedDBName = "ProductRelations"
            loadedDB = utils.products.productRelations
            primaryKeyColumns = ["id", "subProductID"]
            break
        case "Users":
            loadedDBName = "Users"

            let db = await utils.httpRequest(`${config.dburl}/auth/getUsers`, "POST", {}, true)

            loadedDB = db["response"]
            primaryKeyColumns = ["ID"]
            
            break
        default:
            console.log("Error: No database with name " + name + " found")
            break
    }



    document.getElementById("databaseEditor").innerHTML = await loadEditableDB(loadedDB, primaryKeyColumns)
}

export async function loadEditableDB(db, primaryKeyColumns) {
    await utils.products.getProducts(true)
    let html = "<style> table { border-collapse:collapse; border:1px solid #000000; }\n table td {border:1px solid #000000;} </style>"
    html += `<table style="margin: auto;">`
    //create column headers
    let columns = db[0]
    for(let column in columns) {
        html += `<th>${column}</th>`
    }
    html += `<th>Action&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</th>`

    for(let entry in db) {
        html += `<tr>`

        let primaryKeys = {}
        primaryKeyColumns.forEach(key => primaryKeys[key] = db[entry][key]) //create a json object of the primary keys

        for(let column in db[entry]) {
            let functionString = `saveEdit( ${ JSON.stringify(primaryKeys) } , \"${column}\", \"${entry}\")` //create a function to be called when the value is changed
            html += `<td> <input onchange='${functionString}' id="Entry for ${entry} ${column}" type="${typeof db[entry][column]}" value="${db[entry][column]}"> </td>` //create an input field with the value of the column
        }
        html += `<td> <button style="width: 100%;" onclick='deleteEntry(${JSON.stringify(primaryKeys)})'>Delete</button> </td>` //create a button to delete the entry
        html += `</tr>`
    }

    html += "<tr>"

    for(let index in Object.keys(db[0])) {
        let column = Object.keys(db[0])[index]
        html += `<td> <input id="New Entry #${index}" type="${typeof db[0][column]}" name="${column}"> </td>`
    }

    html += `<td> <button style="width: 100%;" onclick='newEntry(${Object.keys(db[0]).length})'>Add Entry</button> </td></tr>`

    html += `</table>`

    return html
}

export async function newEntry(length) {
    let table = {}
    for(let index = 0; index < length; index++) {
        let element = document.getElementById("New Entry #" + index)
        let column = element.getAttribute("name")
        let value = element.value
        
        switch(element.type) {
            case "number":
                value = parseFloat(value)
                break
            case "text":
                value = value.toString()
                break
        }
        
        table[column] = value
    }

    let response = await utils.httpRequest(`${config.dburl}/db/newEntry`, "POST",
    {
        // "auth": authToken,
        "table": loadedDBName,
        "values": table
    }, false)
    await loadDB(loadedDBName)
    console.log(response)
}

export async function saveEdit(primaryKeys, column, entryID) {

    let element = document.getElementById(`Entry for ${entryID} ${column}`) //get the element that was changed
    let value = element.value //get the new value

    switch(element.type) { //convert to proper type
        case "number":
            value = parseFloat(value)
            break
        case "string":
            value = value.toString()
            break
    }

    let response = await utils.httpRequest(`${config.dburl}/db/update`, "PATCH",
    {
        "table": loadedDBName,
        "primaryKeys": primaryKeys,
        "column": column,
        "value": value  
    }, true)

    console.log(response)
}


export async function deleteEntry(primaryKeys) {
    if(confirm(`Are you sure you want to delete this entry?\n${JSON.stringify(primaryKeys)}`)) {
        let response = await utils.httpRequest(`${config.dburl}/db/deleteEntry`, "DELETE",
        {
            // "auth": authToken,
            "table": loadedDBName,
            "primaryKeys": primaryKeys
        })
        if(response["response"] != "Entry deleted") {
            alert(`There was an error deleting the entry under the keys ${JSON.stringify(primaryKeys)}:\n ${response["response"]}`)
        } else {
            alert("Entry deleted")
        }
    }
    await loadDB(loadedDBName)
}


export async function getJson() {
	let response = await utils.httpRequest(`${config.dburl}/db/getJson`, "POST", {"table": loadedDBName});
	console.log(response["response"]);
	console.log(JSON.stringify(response["response"]));
}