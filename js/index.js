var drawProject = function (project, sha, specialProjectPages) {
    var name = project['name'];
    if (ignoreProjects)
        var description = project['description'];
    var link = project['html_url'];
    var imageUrl = "https://rawcdn.githack.com/Panintelligence/" + name + "/" + sha + "/changes/images/" + name + "-logo.svg"
    var link = specialProjectPages.indexOf(name) > -1 ? (name + ".html") : ("https://github.com/Panintelligence/" + name)

    var element = document.createElement('div');
    element.className = "project";

    var logoElem = document.createElement('a');
    logoElem.className = "logo";
    logoElem.setAttribute("href", link);

    var imageElem = document.createElement('img');
    imageElem.setAttribute("src", imageUrl);

    var nameElem = document.createElement('div');
    nameElem.innerHTML = name;

    var descriptionElem = document.createElement('div');
    descriptionElem.className = "description";
    descriptionElem.innerHTML = description;

    logoElem.append(imageElem);
    logoElem.append(nameElem);
    element.append(logoElem);
    element.append(descriptionElem);

    return element
}


var projectPages = ["picons"];
var ignoreProjects = ["panintelligence.github.io", "exp4j];
var projectList = document.getElementById("project-list");
github.projects(function (projectsInfo) {
    projectList.innerHTML = "";
    for (var i = 0; i < projectsInfo.length; i++) {
        var projectName = projectsInfo[i]['name'];
        if (projectsInfo[i] && ignoreProjects.indexOf(projectName) === -1) {
            (function(proj){
                github.ref(projectName, function (refInfo) {
                    var elem = drawProject(proj, refInfo.object['sha'], projectPages);
                    projectList.append(elem);
                });
            })(projectsInfo[i]);
        }
    }
});
