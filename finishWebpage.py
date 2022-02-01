#I use a website maker to produce the HTML, this script automatically edits elements of the webpage the site maker doesnt let me do
import re

pages = [
    ["Shop.html", ["shop.js"]],
    ["Checkout.html", ["nocors.js", "itemInfo.js", "checkout.js"]],
    ["Orders.html", ["nocors.js", "orders.js"]],
    ["Home.html", [""]],
    ["index.html", [""]],
    ["finalize.html", ["finalize.js"]],
]

for pageInfo in pages:
    name = pageInfo[0]
    scripts = pageInfo[1]

    with open(name, "r") as page:
        newPage = page.read().split("\n")

        for index, element in enumerate(newPage):

            if('<a href="https://function/' in element):
                css = element.split('"')[3]
                function = element.split('/')[3]
                parameters = '"' + '\", \"'.join(element.split('/')[4:-2]) + '"'
                parameters = "" if (parameters == '""' ) else parameters
                buttonText = re.split("<|>", element)[-3]
                newPage[index] = f"                <button onClick='{function}({parameters})' class=\"{css}\">{buttonText}</button>"


            if("<footer class=" in element):
                newPage = newPage[0:index-2]

                for script in scripts:
                    if(script != ""):
                        newPage.append(f"    <script src=\"{script}\"></script>")

                newPage.append("  </body>\n</html>")
        
        newPage = ("\n".join(newPage))
    
    with open(name, "w") as page:
        page.write(newPage)