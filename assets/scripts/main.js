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
        console.log(data);
        var pages = data.query.pages;
        var randomEntry = pages[Object.keys(pages)[0]];
        console.log(randomEntry.linksHere);
        getRandomLinks(randomEntry)
    });
}
///w/api.php?action=query&format=json&prop=linkshere&pageids=1621554&lhnamespace=0&lhshow=!redirect&lhlimit=max
var queryWikipediaId = function (Id) {
    
    var queryURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=linkshere&pageids=" + Id + "&lhnamespace=0&lhshow=!redirect&lhlimit=max";
    $.getJSON(queryURL, function (data) {
        var pages = data.query.pages;
        console.log(pages);
        var randomEntry = pages[Object.keys(pages)[0]];
        var links = randomEntry.linkshere;
        //console.log(links);
        getRandomLinks(links, 25);
        
    });
}

var queryWikipediaArticle = function (title) {
    title = title.split(" ").join("+");
    console.log(title);
    var queryURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=linkshere&titles=" + title + "&lhnamespace=0&lhshow=!redirect&lhlimit=max";
    $.getJSON(queryURL, function (data) {
        var pages = data.query.pages;
        console.log(pages);
        var randomEntry = pages[Object.keys(pages)[0]];
        var links = randomEntry.linkshere;
        //console.log(links);
        getRandomLinks(links, 25);
        
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
    }

}, false);

var parseWikiArticle = function (content) {
    worker.postMessage({ 'cmd': 'parseWikiArticle', 'content': content });
}

function getRandomLinks(links, numberOfLinks){
    var randomLinks = [];
    for(var i = 0; i < numberOfLinks; i++){
        var randomIndex = Math.floor((Math.random() * links.length));
        randomLinks.push(links[randomIndex]);
    }
    console.log(randomLinks);
    drawTitles(randomLinks);
    return randomLinks;
    
}



AFRAME.registerComponent('wikiLink', {
    init: function(){
        console.log("initiated u fuck");
        this.el.addEventListener('click', function(){
            console.log("Get on my level hoe!");
            console.log(this.el.classlist);
        })
    }
})

var count = 0;
var drawTitles = function(randomLinks){
    for(var i = 0; i < randomLinks.length; i++){
        var linkNode = document.getElementById("card" + i);
        var linkTextId = "card" + i + "Text";
        var linkTextNode = document.getElementById(linkTextId);
        linkNode.pageid = randomLinks[i].pageid


         AFRAME.utils.entity.setComponentProperty(linkTextNode, 'bmfont-text', {text: randomLinks[i].title, align: "center"});
    }
}

var init = function(){
    for(var i = 0; i < 25; i++){
    var item = document.getElementById("card" + i);
    item.pageid = 0;
    item.addEventListener("click", function(){
        console.log("Clicked!");
        queryWikipediaId(this.pageid);
    })
}
}

var scene = document.querySelector('a-scene');
if (scene.hasLoaded) {
  init();
} else {
  scene.addEventListener('loaded', init);
}