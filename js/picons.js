var glyphElements = {
    "charts": {},
    "data": {}
};
var iconSetSectionElements = {};

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

var createGlyphElementsFromCss = function (response, iconset) {
    var iconClasses = extractIcons(response, iconset).sort();
    for (var j = 0; j < iconClasses.length; j++) {
        var glyphElement = makeGlyphBox(iconClasses[j])
        glyphElements[iconset][iconClasses[j]] = glyphElement;
    }
}

var createIconsetSection = function(iconset) {
    var iconsetSection = document.createElement("div");
    iconsetSection.className = "iconset-section";

    var iconsetName = document.createElement("h2");
    iconsetName.className = "iconset-section-name";
    iconsetName.innerHTML = iconset;

    var iconsetSectionIconContainer = document.createElement("div");
    iconsetSectionIconContainer.className = "iconset-section-icons";

    iconsetSection.append(iconsetName);
    iconsetSection.append(iconsetSectionIconContainer);

    return {
        container: iconsetSection,
        title: iconsetName,
        iconContainer: iconsetSectionIconContainer
    };
}

var fetchIcons = function (iconsets, allIconSetSections) {
    var cssLinks = document.getElementsByTagName('body')[0].getElementsByTagName('link');
    github.ref("picons", function (refInfo) {
        for (var i = 0; i < iconsets.length; i++) {
            var cssFileUrl = "https://rawcdn.githack.com/Panintelligence/picons/" + refInfo.object['sha'] + "/dist/css/picons-" + iconsets[i] + ".css"
            cssLinks[i].href = cssFileUrl;
            textGET(cssFileUrl, (function(i){
                return function(response){
                    document.getElementById("loading-msg").className = "hide";
                    createGlyphElementsFromCss(response, iconsets[i]);
                    drawGlyphBoxes(allIconSetSections[iconsets[i]].iconContainer, glyphElements[iconsets[i]]);
                }
            })(i));
        }
    });
}

fillBannerLogo();

var glyphSection = document.getElementById("glyphs");
var definedIconSets = Object.keys(glyphElements);
for(var i=0; i<definedIconSets.length; i++){
    iconSetSectionElements[definedIconSets[i]] = createIconsetSection(definedIconSets[i]);
    iconSetSectionElements[definedIconSets[i]].title.innerHTML = definedIconSets[i] +
        " <code class='css-link'>&lt;<span class='syntax-tag'>link</span> <span class='syntax-property'>href=</span><span class='syntax-string'>'" +
        "/styles/picons-" + definedIconSets[i] + ".css" +
        "'</span> <span class='syntax-property'>rel=</span><span class='syntax-string'>'stylesheet'</span>&gt;</code>"
    glyphSection.append(iconSetSectionElements[definedIconSets[i]].container);
}

fetchIcons(definedIconSets, iconSetSectionElements);

var search = document.getElementById("search");
search.addEventListener("keyup", function (e) {
    var value = e.target.value;
    if (value === "") {
        for(var s=0; s<definedIconSets.length; s++){
            drawGlyphBoxes(iconSetSectionElements[definedIconSets[s]].iconContainer, glyphElements[definedIconSets[s]]);
        }
    }
    else {
        for(var s=0; s<definedIconSets.length; s++){
            var allKeys = Object.keys(glyphElements[definedIconSets[s]])
            var keys = [];
            for (var i = 0; i < allKeys.length; i++) {
                if (allKeys[i].indexOf(value) >= 0) {
                    keys.push(allKeys[i]);
                }
            }
            drawGlyphBoxes(iconSetSectionElements[definedIconSets[s]].iconContainer, glyphElements[definedIconSets[s]], keys);
        }
    }
});

var downloadButton = document.getElementById("download-btn");
github.release("picons", "latest", function (info) {
    downloadButton.innerHTML = "Download " + info['tag_name'];
    downloadButton.setAttribute("href", info.assets[0]['browser_download_url']);
});