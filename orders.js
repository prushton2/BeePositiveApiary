doc = document.getElementById("sec-214c")
dburl = "https://beepositiveapiarynodeserver.prushton.repl.co/"

renderpage = async() => {
    orders = await getURLWithoutCors(dburl+"get/"+document.getElementById("pswdinput").value+"/orders")
    doc.innerHTML = orders
}

renderpage()