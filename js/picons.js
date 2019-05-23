var extractIcons = function (cssContent) {
    return cssContent.split(/\.picons/).join("\n.picons").match(/\.picons-charts-.*:before/g) || []
}

var makeGlyphBox = function (classname) {
    var glyphClassName = classname.substr(1, classname.length - 8);
    var glyphBox = document.createElement("div");
    glyphBox.className = "glyph-box";

    var glyphContainer = document.createElement("div");
    var glyph = document.createElement("i");
    glyph.className = glyphClassName;

    var glyphName = document.createElement("div");
    glyphName.className = "glyph-name";
    glyphName.innerHTML = glyphClassName;

    var textarea = document.createElement("div");
    textarea.className = "glyph-code";
    textarea.innerHTML = "&lt;i class='" + glyphClassName + "'&gt;&lt;/i&gt;"

    glyphContainer.append(glyph);
    glyphBox.append(glyphContainer);
    glyphBox.append(glyphName);
    glyphBox.append(textarea);
    glyphBox.addEventListener('click', function (e) {
        selectText(textarea);
    });
    return glyphBox;
}

var drawGlyphBoxes = function (container, glyphsObject, optKeys) {
    var keys = !optKeys ? Object.keys(glyphsObject) : optKeys;
    var justifyContent = keys.length > 4 ? "space-between" : "left";
    var sideMargin = keys.length <= 4 ? "16px" : "0";

    container.innerHTML = "";
    container.style = "justify-content: " + justifyContent + ";"
    for (var i = 0; i < keys.length; i++) {
        var elem = glyphsObject[keys[i]];
        elem.style = "margin-left: " + sideMargin + "; margin-right: " + sideMargin + ";";
        container.append(elem);
    }
}

var glyphSection = document.getElementById("glyphs");
var search = document.getElementById("search");
var downloadButton = document.getElementById("download-btn");
var bannerLogo = document.getElementById('banner-logo');
var glyphElements = {};
bannerLogo.setAttribute('style', "opacity: 0.5;");

search.addEventListener("keyup", function (e) {
    var value = e.target.value;
    if (value === "") {
        drawGlyphBoxes(glyphSection, glyphElements);
    }
    else {
        var allKeys = Object.keys(glyphElements)
        var keys = [];
        for (var i = 0; i < allKeys.length; i++) {
            if (allKeys[i].indexOf(value) >= 0) {
                keys.push(allKeys[i]);
            }
        }
        drawGlyphBoxes(glyphSection, glyphElements, keys);
    }
});

var fetchIcons = function () {
    github.ref("picons", function (refInfo) {
        var cssFileUrl = "https://rawcdn.githack.com/Panintelligence/picons/"+refInfo.object['sha']+"/dist/css/picons-charts.css"
        var logoUrl = "https://rawcdn.githack.com/Panintelligence/picons/"+refInfo.object['sha']+"/changes/images/picons-logo.svg"
        document.getElementsByTagName('body')[0].getElementsByTagName('link')[0].href = cssFileUrl;
        bannerLogo.setAttribute('src', logoUrl);
        bannerLogo.setAttribute('style', "opacity: 1;");
        textGET(cssFileUrl, function(response){
            var iconClasses = extractIcons(response).sort();
            for (var i = 0; i < iconClasses.length; i++) {
                var glyphElement = makeGlyphBox(iconClasses[i])
                glyphElements[iconClasses[i]] = glyphElement;
            }
            drawGlyphBoxes(glyphSection, glyphElements);
        })
        refInfo.object['sha']
    });
}



fetchIcons();
github.release("picons", "latest", function (info) {
    downloadButton.innerHTML = "Download " + info['tag_name'];
    downloadButton.setAttribute("href", info.assets[0]['browser_download_url']);
});