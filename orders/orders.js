doc = document.getElementById("orders")
dburl = "https://beepositiveapiarynodeserver.prushton.repl.co/"

renderpage = async() => {
    orders = await getURLWithoutCors(dburl+"get/orders")
    // doc.innerHTML = 
}

renderpage()