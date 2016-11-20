var worker = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], { type: 'text/javascript' })));

var getImageURL = function (title) {
    var newTitle = replaceSpaces(title);
    console.log(newTitle);
    var imageString = "https://upload.wikimedia.org/wikipedia/commons/";
    var hash = md5(newTitle);
    var imageURL = imageString + hash.charAt(0) + "/" + hash.charAt(0) + hash.charAt(1) + "/" + newTitle;
    return imageURL;
}

var replaceSpaces = function (title) {
    var newTitle = title.split(' ').join('_')
    return newTitle;
}

var wikipediaURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cimages%7Clinks&titles=Stack+Overflow&formatversion=2&exlimit=1&exintro=1&explaintext=1&exsectionformat=plain&pllimit=500&pldir=ascending"

var queryWikipedia = function () {

    $.getJSON(wikipediaURL, function (data) {
        var pages = data.query.pages;
        console.log(pages[0]);
        getWikiText(pages[0]);
        getWikiPageLinks(pages[0]);
    });
}

var getWikiText = function (wikiPage) {
    var text = wikiPage.extract;
    text.split("/n");
    console.log(text);
}

var getWikiPageLinks = function (wikiPage) {
    var temp = [];
    var links = wikiPage.links;
    for (var i = 0; i < wikiPage.links.length; i++) {
        if (links[i].ns == 0) {
            temp.push(links[i].title);
        }
    }
    console.log(temp);

}

var getRandomWikipediaArticle = function () {
    var randomURL = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=random&grnnamespace=0&prop=revisions|images&rvprop=content&grnlimit=2";
    $.getJSON(randomURL, function (data) {
        var pages = data.query.pages;
        var randomEntry = pages[Object.keys(pages)[0]];
        //console.log(randomEntry);
        var latestRevision = randomEntry.revisions[0];
        //console.log(latestRevision['*']);
        var wikiText = latestRevision['*'];
        parseWikiArticle(wikiText);
    });
}

var queryWikipediaArticle = function (title) {
    title = title.split(" ").join("+");
    console.log(title);
    var queryURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&titles=" + title + "&formatversion=1&rvprop=content";
    $.getJSON(queryURL, function (data) {
        var pages = data.query.pages;
        var randomEntry = pages[Object.keys(pages)[0]];
        //console.log(randomEntry);
        var latestRevision = randomEntry.revisions[0];
        //console.log(latestRevision['*']);
        var wikiText = latestRevision['*'];
        parseWikiArticle(wikiText);
    });
}

var parseText = function (textMap) {

}

worker.addEventListener('message', function (e) {
    var parsedData = e.data.parsedData;
    console.log("we got data back");
    console.log(parsedData.text);
    var textMap = parsedData.text;
    var entriesInMap = textMap.entries();
    var mapSize = textMap.size;
    for(var i = 0; i < mapSize; i++){
        var item = entriesInMap.next();
        createSection(item);
    }

}, false);

var parseWikiArticle = function (content) {
    worker.postMessage({ 'cmd': 'parseWikiArticle', 'content': content });
}

var createSection = function(item){
    var sectionTitle = item.value[0];
    var sectionStringsArray = item.value[1];
    console.log(item.value[1]);
    var completeString = "";
    for(var i = 0; i < sectionStringsArray.length; i++){
        completeString = completeString + " " + sectionStringsArray[i].text;
    }
    console.log(completeString);

}