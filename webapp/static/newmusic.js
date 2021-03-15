//Ann Beimers and Matthew Smith-Erb

window.addEventListener("load", initializeNewMusic);

//persistent arrays needed for autoComplete suggestions
var suggestions1 = [];
var suggestions2 = [];

//itinialize the page
function initializeNewMusic() {
    document.addEventListener('keydown', navigateWithArrows);
    assignArtistSearch();
}

//keyboard navigation
function navigateWithArrows(key) {
    var activeElement = document.activeElement;
    //check if a suggestion button is already focussed
    if(activeElement.parentElement.className == "top-options"){
        var buttons = activeElement.parentElement.children;
        if(key.code == "ArrowDown"){
            key.preventDefault();
            if(activeElement.nextElementSibling != null){
                activeElement.nextElementSibling.focus();
            }
        }else if(key.code == "ArrowUp"){
            key.preventDefault();
            if(activeElement.previousElementSibling != null){
                activeElement.previousElementSibling.focus();
            }
        }
    //set focus to the first suggestion button if trying to get out of input
}else if(activeElement.className == "option-input" && activeElement.parentElement.lastElementChild.firstElementChild != null){
        if(key.code == "ArrowDown"){
            key.preventDefault();
            activeElement.parentElement.lastElementChild.firstElementChild.focus();
        }
    }

}


//creates autocomplete for artists
function assignArtistSearch(){
    //add the autoComplete for artists
    document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "artist")};
    document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "artist")};

    var artist1input = document.getElementById("option1_input");
    var artist2input = document.getElementById("option2_input");
    document.getElementById("go").onclick = function(){query("artist", artist1input, artist2input)}
}

//generates the autocoplete html - called when there is input in a field
function autoComplete(inputObj, searchType){
    if (searchType != "song" && searchType != "artist"){
        throw "searchType must be a song an artist";
    }
    var buttonContainer = inputObj.parentElement.lastElementChild;
    //create the buttons if they don't exist
    if (buttonContainer.children.length == 0){
        var buttonBody = "";
        for(var i = 0; i < 5; i ++){
            buttonBody += "<button>&nbsp</button>\n";
        }
        buttonContainer.innerHTML = buttonBody;
    }

    var searchButtons = buttonContainer.children;
    //make the buttons blank if there is nothing in the input
    if(inputObj.value == ""){
        for(var i = 0; i < searchButtons.length; i++){
            searchButtons[i].innerHTML="&nbsp";
            searchButtons[i].value = "";
            searchButtons[i].onclick = null;
        }
    }else{
        if(inputObj.id == "option1_input"){
            generateSuggestions(inputObj.value, searchButtons, inputObj, suggestions1, searchType);
        }else if(inputObj.id == "option2_input"){
            generateSuggestions(inputObj.value, searchButtons, inputObj, suggestions2, searchType);
        }
    }
}

//generates the suggestions for autocomplete
function generateSuggestions(search, buttons, inputObj, suggestionList, searchType){
    if (searchType != "song" && searchType != "artist"){
        throw "searchType must be a song an artist";
    }

    var url = getAPIBaseURL() + "/search/" + searchType +"/" + search;
    fetch(url, {method: 'get'})
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        for(var i = 0; i < data.length; i++){
            if(searchType == "artist"){
                var suggestionName = data[i].artist_name;
                buttons[i].innerHTML = suggestionName;
            }else if(searchType == "song"){
                var suggestionName = data[i].song_name + " (" + data[i].year + ")";
                buttons[i].innerHTML = suggestionName;
            }
            suggestionList[i] = {
                name: suggestionName,
                id: data[i].id
            };

            //assign the correct assignment function, take off last 7 characters (the year) if song searching
            if(searchType == "song"){
                buttons[i].onclick = function(){
                    inputObj.value = this.innerText.substring(0, this.innerText.length - 7);
                    //hides the suggestions this button is a part of
                    this.parentElement.innerHTML = "";
                }
            }else{
                buttons[i].onclick = function(){
                    inputObj.value = this.innerText;
                    //hides the suggestions this button is a part of
                    this.parentElement.innerHTML = "";
                }
            }
        }
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
}

//ensure that the user wrote input which matches a given suggestion
function validateInput(inputObj, inputType){
    if(inputType != "song" && inputType != "artist"){
        throw "inputType must be 'song' or 'artist'";
    }
    var name = inputObj.value;
    var suggestions = [];
    if(inputObj.id == "option1_input"){
        suggestions = suggestions1;
    }else if(inputObj.id == "option2_input"){
        suggestions = suggestions2;
    }else{
        throw "incorrect input object"
    }

    //check if artistName is one of the possible options
    var artistExists = false;
    var artistId = 0;
    for(var i = 0; i < suggestions.length; i++){
        if(inputType == "artist"){
            if (name == suggestions[i].name){
                return suggestions[i];
            }
        }else if(inputType == "song"){
            //get rid of last 7 characters of suggestion to ignore the year at end
            if (name == suggestions[i].name.substring(0, suggestions[i].name.length - 7)){
                return suggestions[i];
            }
        }

    }

    if(inputType == "artist"){
        alert(name + " is not a valid artist");
        throw "invalid artist";
    }else if(inputType == "song"){
        alert(name + " is not a valid song");
        throw "invalid song";
    }

}

//hide the suggetion buttons
function hideSearchButtons(){
    document.getElementById("option1_input").oninput = function(){};
    document.getElementById("option2_input").oninput = function(){};
    document.getElementById("top-options1").innerHTML = "";
    document.getElementById("top-options2").innerHTML = "";
}

//changes length of bars and assigns their functions
function query(queryType, input1obj, input2obj){
    if (queryType != "year" && queryType != "artist" && queryType != "song"){
        throw "queryType must be 'songs' or 'artists'";
    }

    //parse correct info and assign labels
    try{
        var artist1 = validateInput(input1obj, "artist");
        var artist2 = validateInput(input2obj, "artist");
        var input1 = artist1.id;
        var input2 = artist2.id;
        hideSearchButtons();
        document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "artist")};
        document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "artist")};
    }catch(error){
        //catch the validation error being thrown
        console.log(error);
        return;
    }

    //make results section visible
    document.getElementById("results").style.visibility = "visible";
    document.getElementById("results-contents").style.visibility = "visible";

    var url = getAPIBaseURL() + "/artist/" + artist1.id + "/" + artist2.id;
    fetch(url, {method: 'get'})
    .then(function (response) {
    	// Get a JSON object from each of the responses
    	return response.json();
    }).then(function (data) {
        var url1 = getAPIBaseURL() + "/song/artist/" + data[0].id + "/popularity";
        var url2 = getAPIBaseURL() + "/song/artist/" + data[1].id + "/popularity";
        var url3 = getAPIBaseURL() + "/song/artist/" + data[2].id + "/popularity";
        Promise.all([
            fetch(url1, {method: 'get'}),
            fetch(url2, {method: 'get'}),
            fetch(url3, {method: 'get'}),
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function(data){
            document.getElementById("webplayer1").src = "https://open.spotify.com/embed/track/" + data[0].spotify_id;
            document.getElementById("webplayer2").src = "https://open.spotify.com/embed/track/" + data[1].spotify_id;
            document.getElementById("webplayer3").src = "https://open.spotify.com/embed/track/" + data[2].spotify_id;
        }).catch(function (error) {
        	// if there's an error, log it
        	console.log(error);
        });
    }).catch(function (error) {
    	// if there's an error, log it
    	console.log(error);
    });


}

//return the url of the api we have
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}
