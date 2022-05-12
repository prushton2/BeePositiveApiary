#I use a website maker to produce the HTML, this script automatically edits elements of the webpage the site maker doesnt let me do
import re
import os

pages = {
    "shop":{ 
        "page": "shop/Shop.html",
        "scripts": ["../config.js", "../utils.js", "shop.js", "itemShop.js"]
    },
    "honey":{
        "page": "shop/Honey.html",
        "scripts": ["../config.js", "../utils.js", "shop.js", "honeyShop.js"]
    },
    "orders":{
        "page": "orders/Orders.html",
        "scripts": ["../config.js", "../utils.js", "orders.js"]
    },
    "home":{
        "page": "home/Home.html",
        "scripts": ["../config.js", "../utils.js"]
    },
    "orderconfirmed":{
        "page": "checkout/OrderConfirmed.html",
        "scripts": ["../config.js", "../utils.js", "orderConfirmed.js"]
    },
    "finalize":{
        "page": "checkout/Finalize.html",
        "scripts": ["../config.js", "../utils.js", "finalize.js", "checkout.js"]
    },
    "checkout":{
        "page": "checkout/Checkout.html",
        "scripts": ["../config.js", "../utils.js", "checkout.js"]
    }
}

createFiles = {
    0: {
        "name": "checkout/index.html",
        "content": "<!DOCTYPE HTML><head></head><body><script>window.location.href='Checkout.html';</script></body>" 
    },
    1: {
        "name": "home/index.html",
        "content": "<!DOCTYPE HTML><head></head><body><script>window.location.href='Home.html';</script></body>" 
    },
    2: {
        "name": "orders/index.html",
        "content": "<!DOCTYPE HTML><head></head><body><script>window.location.href='Orders.html';</script></body>" 
    },
    3: {
        "name": "shop/index.html",
        "content": "<!DOCTYPE HTML><head></head><body><script>window.location.href='Shop.html';</script></body>" 
    }
}

deleteFiles = [
    "templates/password",
    "Page-Password-Template.css"
]

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
            if('FUNCTION AS URL:' in element):
                css = element.split('"')[3]
                function = re.split("(FUNCTION AS URL:)|(\" class)", element)[3]
                buttonText = re.split("<|>", element)[-3]

                newPage[index] = f"<button onClick=\"{function}\" class=\"{css}\">{buttonText}</button>"

            if('SETID:' in element):
                css = element.split('"')[3]
                function = re.split("(SETID:)|(\" class)", element)[3]
                buttonText = re.split("<|>", element)[-3]

                newPage[index] = f"<button id=\"{function}\" class=\"{css}\">{buttonText}</button>"


            # Delete footer and insert script tags
            if("<footer class=" in element):
                newPage = newPage[0:index-2]

                for script in scripts:
                    if(script != ""):
                        newPage.append(f'<script type="module" src=\"{script}\"></script>')

                newPage.append("</body>\n</html>")
        
        newPage = ("\n".join(newPage))
    
    with open(name, "w") as page:
        page.write(newPage)

for file in createFiles:
    file = createFiles[file]
    with open(file["name"], "w") as f:
        f.write(file["content"])

for file in deleteFiles:
    os.remove(file)

with open(indexSettings["indexPage"], "w") as page:
    redirectHTML = f"<!DOCTYPE HTML><head></head><body><script>window.location.href='{indexSettings['redirectPage']}';</script></body>"
    page.write(redirectHTML)