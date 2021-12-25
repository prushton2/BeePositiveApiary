#I use a website maker to produce the HTML, this script automatically edits elements of the webpage the site maker doesnt let me do
pages = [
    ["Shop.html", "shop.js"],
    ["Home.html", ""],
    ["index.html", ""],
]


with open("Shop.html", "r") as shop:

    newShop = shop.read().split("\n")
    
    for index, element in enumerate(newShop):
        if('<a href="https://example.com/' in element):
            css = element.split('"')[3]
            itemName = element.split('/')[3]
            newShop[index] = f"                <button onClick='addToCart(\"{itemName}\")' class=\"{css}\">Add to Cart</button>"
    
    newShop = "\n".join(newShop)

with open("Shop.html", "w") as file:
    file.write(newShop)

for pageInfo in pages:
    name = pageInfo[0]
    script = pageInfo[1]

    with open(name, "r") as page:
        newPage = page.read().split("\n")
        for index, element in enumerate(newPage):
            if("<footer class=" in element):
                newPage = newPage[0:index-2]

                if(script != ""):
                    newPage.append(f"    <script src=\"{script}\"></script>")

                newPage.append("  </body>\n</html>")
                newPage = ("\n".join(newPage))
    
    with open(name, "w") as page:
        page.write(newPage)