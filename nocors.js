const getURLWithoutCors = async(url) => {
    response = await fetch("https://corsanywherepr.herokuapp.com/"+url).then((data) => {
        responsejson = data.text().then((value) => {
            return value
        });
        return responsejson;
    });
    return response
}