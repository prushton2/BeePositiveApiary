import * as utils from "../utils.js"
import * as config from "../config.js"

export let loadedDBName = ""
export let loadedDB
export let queuedEdits = {"edits": []}

let password = document.getElementById("pswdinput")
let uneditableColumns = ["id", "subProductID"]

window.loadDB = loadDB
window.saveDB = saveDB
window.queueEdit = queueEdit
window.getEdits = getEdits

export async function loadDB(name) {
    let primaryKeyColumns

    await utils.products.getProducts(true)

    switch(name) {
        case "products":
            loadedDBName = "Products"
            loadedDB = utils.products.products
            primaryKeyColumns = ["id"]
            break
        case "productRelations":
            loadedDBName = "ProductRelations"
            loadedDB = utils.products.productRelations
            primaryKeyColumns = ["id", "subProductID"]
            break
        default:
            console.log("Error: No database with name " + name + " found")
            break
    }



    document.getElementById("databaseEditor").innerHTML = loadEditableDB(loadedDB, primaryKeyColumns)
    queuedEdits = {"edits": []}
}

export async function saveDB() {
    for(let edit in queuedEdits["edits"]) {
        let index = edit
        edit = queuedEdits["edits"][edit]
        let column = edit["column"]
        let primaryKeys = edit["primaryKeys"]
        let value = edit["value"]
        let table = loadedDBName
        let response = await utils.httpRequest(`${config.dburl}/db/update`, "PATCH", 
        {
            "password": password.value,
            "table": table,
            "primaryKeys": primaryKeys,
            "column": column,
            "value": value
        })
        if(response["response"] != "Product Updated") {
            alert(`There was an error updating the ${column} column on the ${table} table under the keys ${primaryKeys} to value ${value}:\n ${response["response"]}`)
        } else {
            queuedEdits["edits"][index] = null
        }
    }
    queuedEdits["edits"] = queuedEdits["edits"].filter(value => value != null)
    //get the current time in HH:MM
    let time = new Date().toLocaleTimeString()
    document.getElementById("response").innerHTML = `${JSON.stringify(queuedEdits) == '{"edits":[]}' ? "All values updated successfully" : "Some values were not updated"} (${time})`
}

export function loadEditableDB(db, primaryKeyColumns) {
    let html = "<style> table { border-collapse:collapse; border:1px solid #000000; }\n table td {border:1px solid #000000;} </style>"
    html += `<table>`
    //create column headers
    let columns = db[0]
    for(let column in columns) {
        html += `<th>${column}</th>`
    }

    for(let entry in db) {
        html += `<tr>`
        for(let column in db[entry]) {
            if(uneditableColumns.includes(column)) {
                html += `<td> <label>${db[entry][column]}</label> </td>`
            } else {
                let primaryKeys = {}
                primaryKeyColumns.forEach(key => primaryKeys[key] = db[entry][key])
                let functionString = `queueEdit( ${ JSON.stringify(primaryKeys) } , \"${column}\", \"${entry}\")`
                html += `<td> <input onchange='${functionString}' id="Entry for ${entry} ${column}" type="${typeof db[entry][column]}" value="${db[entry][column]}"> </td>`
            }
        }
        html += `</tr>`
    }

    html += `</table>`

    return html
}

export function queueEdit(primaryKeys, column, entryID) {

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

    let editExists = false //check if the edit already exists (if it does, overwrite it)
    for(let edit in queuedEdits["edits"]) {
        edit = queuedEdits["edits"][edit]
        
        if(JSON.stringify(edit["primaryKeys"]) == JSON.stringify(primaryKeys) && edit["column"] == column) {
            edit["value"] = value
            editExists = true
        }
    }

    if(!editExists) { //if the edit doesn't exist, add it
        queuedEdits["edits"].push({
            "primaryKeys": primaryKeys,
            "column": column,
            "value": value
        })
    }
}

export function getEdits() {
    return queuedEdits
}