var github = {
    release: function(project, version, f) {
        jsonGET("https://api.github.com/repos/Panintelligence/"+project+"/releases/"+version, f);
    },
    projects: function(f) {
        jsonGET("https://api.github.com/users/panintelligence/repos", f)
    },
    ref: function(project, f){
        jsonGET("https://api.github.com/repos/Panintelligence/"+project+"/git/refs/heads/master", f)
    }
};