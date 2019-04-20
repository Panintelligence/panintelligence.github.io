var selectText = function (element) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
};

var GET = function (url, f) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = f;
    request.open('GET', url);
    request.send();
    return request;
};

var textGET = function(url, f) {
    GET(url, function(evt){
        var request = evt.target;
        if (request.readyState == 4 && request.status === 200) {
            f(request.response);
        }
    })
};

var jsonGET = function(url, f) {
    GET(url, function(evt){
        var request = evt.target;
        if (request.readyState == 4 && request.status === 200) {
            var releaseInfo = JSON.parse(request.response);
            f(releaseInfo);
        }
    })
};