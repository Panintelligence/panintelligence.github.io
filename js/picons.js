var glyphElements = {};


var extractIcons = function (cssContent, iconset) {
    var regexp = new RegExp("\.picons-" + iconset + "-.*:before", "g");
    return cssContent.split(/\.picons/).join("\n.picons").match(regexp) || []
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

var fillBannerLogo = function () {
    var bannerLogo = document.getElementById('banner-logo');
    bannerLogo.setAttribute('style', "opacity: 0.5;");
    github.ref("picons", function (refInfo) {
        var logoUrl = "https://rawcdn.githack.com/Panintelligence/picons/" + refInfo.object['sha'] + "/changes/images/picons-logo.svg"
        bannerLogo.setAttribute('src', logoUrl);
        bannerLogo.setAttribute('style', "opacity: 1;");
    });
};

var drawGlyphsFromCss = function (response, section, iconset) {
    var iconClasses = extractIcons(response, iconset).sort();
    for (var j = 0; j < iconClasses.length; j++) {
        var glyphElement = makeGlyphBox(iconClasses[j])
        glyphElements[iconClasses[j]] = glyphElement;
    }
    drawGlyphBoxes(section, glyphElements);
}

var fetchIcons = function (iconsets, section) {
    var cssLinks = document.getElementsByTagName('body')[0].getElementsByTagName('link');
    github.ref("picons", function (refInfo) {
        for (var i = 0; i < iconsets.length; i++) {
            var cssFileUrl = "https://rawcdn.githack.com/Panintelligence/picons/" + refInfo.object['sha'] + "/dist/css/picons-" + iconsets[i] + ".css"
            cssLinks[i].href = cssFileUrl;
            textGET(cssFileUrl, (function(i){
                return function(response){
                    drawGlyphsFromCss(response, section, iconsets[i]);
                }
            })(i));
        }
    });
}

fillBannerLogo();

var glyphSection = document.getElementById("glyphs");
fetchIcons(["charts", "data"], glyphSection);

var search = document.getElementById("search");
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

var downloadButton = document.getElementById("download-btn");
github.release("picons", "latest", function (info) {
    downloadButton.innerHTML = "Download " + info['tag_name'];
    downloadButton.setAttribute("href", info.assets[0]['browser_download_url']);
});