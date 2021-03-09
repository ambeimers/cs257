//Ann Beimers and Matthew Smith-Erb

window.onload = initialize;

function initialize(){
    //assign paths
    var homeButton = document.getElementById("index-nav");
    var comparatorButton = document.getElementById("comparator-nav");
    var newMusicButton = document.getElementById("newmusic-nav");
    var lookupButton = document.getElementById("lookup-nav");
    homeButton.onclick = function(){window.location.href = getBaseURL() +"/"};
    comparatorButton.onclick = function(){window.location.href = getBaseURL() + "comparator.html"; };
    newMusicButton.onclick = function(){window.location.href = getBaseURL() + "newmusic.html"; };
    lookupButton.onclick = function(){window.location.href = getBaseURL() + "lookup.html"; };

    //disable button of current place
    var path = window.location.pathname;
    var id = path.substring(1, path.length - 5) + "-nav";
    //correect for the home not having an actual path with .html
    if (id == "/-nav"){
        id = "index-nav";
    }
    document.getElementById(id).disabled = true;
}

function getBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
    return baseURL;
}
