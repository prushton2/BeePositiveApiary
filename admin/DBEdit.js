import * as utils from "../utils.js"
import * as config from "../config.js"

export let loadedDBName = ""
export let loadedDB
export let queuedEdits = {}


export let password = document.getElementById("pswdinput")
let uneditableColumns = ["id", "subProductID"]

window.loadDB = loadDB
window.saveDB = saveDB
window.queueEdit = queueEdit
window.getEdits = getEdits

export function loadDB(name) {
    let primaryKeyColumns
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
    queuedEdits = {}
}

export async function saveDB() {
    let allValuesUpdated = true
    for(let edit in queuedEdits) {
        let column = edit.split("/")[1]
        let primaryKeys = edit.split("/")[0].split(" ")
        let value = queuedEdits[edit]
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
            allValuesUpdated = false
            alert(`There was an error updating the ${column} column on the ${table} table under the keys ${primaryKeys} to value ${value}:\n ${response["response"]}`)
        } else {
            delete queuedEdits[edit]
        }
    }
    //get the current time in HH:MM
    let time = new Date().toLocaleTimeString()

    document.getElementById("response").innerHTML = `${allValuesUpdated ? "All values updated successfully" : "Some values were not updated"} (${time})`
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
                let primaryKeys = primaryKeyColumns.map(key => db[entry][key])
                html += `<td> <input onchange='queueEdit( "${ primaryKeys.join(" ") }" , "${column}", "${entry}")'  id="Entry for ${entry} ${column}" type="${typeof db[entry][column]}" value="${db[entry][column]}"> </td>`
            }
        }
        html += `</tr>`
    }

    html += `</table>`

    return html
}

export function queueEdit(primary_key, column, entryID) {
    queuedEdits[`${primary_key}/${column}`] = document.getElementById(`Entry for ${entryID} ${column}`).value
}

export function getEdits() {
    return queuedEdits
}