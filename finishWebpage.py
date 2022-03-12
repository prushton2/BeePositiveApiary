#I use a website maker to produce the HTML, this script automatically edits elements of the webpage the site maker doesnt let me do
import re
import os

pages = {
    "shop":{
        "page": "shop/Shop.html",
        "scripts": ["shop.js"],
        "renameTo": "index.html"
    },
    "checkout":{
        "page": "checkout/Checkout.html",
        "scripts": ["../itemInfo.js", "checkout.js"],
        "renameTo": "index.html"
    },
    "orders":{
        "page": "orders/Orders.html",
        "scripts": ["../itemInfo.js", "orders.js"],
        "renameTo": "index.html"
    },
    "home":{
        "page": "home/Home.html",
        "scripts": [],
        "renameTo": "index.html"
    },
    "finalize":{
        "page": "finalize/Finalize.html",
        "scripts": ["../itemInfo.js", "finalize.js"],
        "renameTo": "index.html"
    }
}

indexSettings = {
    "indexPage": "index.html",
    "redirectPage": "home/Home.html"
}

for pageInfo in pages:

    name =    pages[pageInfo]["page"]
    scripts = pages[pageInfo]["scripts"]

    with open(name, "r") as page:
        newPage = page.read().split("\n")

        for index, element in enumerate(newPage):

            # replace all function URLs with their functions
            if('<a href="https://function/' in element):
                css = element.split('"')[3]
                function = element.split('/')[3]
                parameters = '"' + '\", \"'.join(element.split('/')[4:-2]) + '"'
                parameters = "" if (parameters == '""' ) else parameters
                buttonText = re.split("<|>", element)[-3]
                newPage[index] = f"<button onClick='{function}({parameters})' class=\"{css}\">{buttonText}</button>"

            # Delete footer and insert script tags
            if("<footer class=" in element):
                newPage = newPage[0:index-2]

                for script in scripts:
                    if(script != ""):
                        newPage.append(f"<script src=\"{script}\"></script>")

                newPage.append("</body>\n</html>")
        
        newPage = ("\n".join(newPage))
    
    with open(name, "w") as page:
        page.write(newPage)

with open(indexSettings["indexPage"], "w") as page:
    redirectHTML = f"<!DOCTYPE HTML><head></head><body><script>window.location.href='{indexSettings['redirectPage']}';</script></body>"
    page.write(redirectHTML)