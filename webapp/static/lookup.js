//Ann Beimers and Matthew Smith-searchButtons
window.addEventListener("load", lookupInitialize);
suggestions = [];

function lookupInitialize() {
    var selection = document.getElementById("options");
    selection.addEventListener("change", onOptionChange);

    //set the defualts too
    onOptionChange();
}

//Changed the text for the input areas according to what they are searching
function onOptionChange(){
    var selection = document.getElementById("options");
    var choice = selection.value;

    var option = document.getElementById("option_input");
    option.value = "";
    var optionlabel = document.getElementById("option_label");

    optionlabel.innerHTML = choice

    if (choice == "artist"){
        option.placeholder = "enter an artist"
    }else{
        option.placeholder = "enter a year"
    }

    var goButton = document.getElementById("go");
    if (choice == "year"){
        assignYearSearch();
        go.onclick = function(){query("year", option)};
    }else if(choice == "artist"){
        assignArtistSearch();
        go.onclick = function(){query("artist", option)};
	}
}

//Generate year list and add it
function assignYearSearch(){
    hideSearchButtons();
    var datalistBody = "";
    for (var y = 1924; y <= 2021; y++){
        datalistBody += "<option>" + y + "</option>\n";
    }
    var yearDatalist = document.getElementById("year");

    yearDatalist.innerHTML = datalistBody;

    var yearinput = document.getElementById("option_input");
    document.getElementById("go").onclick = function(){query("year", yearinput)};
}

//Hides the year datalist
function hideYearSearch(){
    document.getElementById("year").innerHTML = "";
}

//creates autocomplete for artists
function assignArtistSearch(){
    hideYearSearch();
    //don't double add the event
    document.getElementById("option_input").removeEventListener("input", autoComplete);
    document.getElementById("option_input").addEventListener("input", autoComplete);

    var artist_input = document.getElementById("option_input");
    document.getElementById("go").onclick = function(){query("artist", artist_input)}
}

function validateArtist(inputObj){
    var artistName = inputObj.value;

    //check if artistName is one of the possible options
    var artistExists = false;
    var artistId = 0;
    for(var i = 0; i < suggestions.length; i++){
        if (artistName == suggestions[i].artistName){
            return suggestions[i]
        }
    }

    alert(artistName + " is not a valid artist");
    throw "invalid artist";
}

//generates the autocoplete html
function autoComplete(){
    var buttonContainer = this.parentElement.lastElementChild;
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
    if(this.value == ""){
        for(var i = 0; i < searchButtons.length; i++){
            searchButtons[i].innerHTML="&nbsp";
            searchButtons[i].value = "";
            searchButtons[i].onclick = null;
        }
    }else{
        if(this.id == "option_input"){
            generateSuggestions(this.value, searchButtons, this, suggestions);
        }
    }
}

function hideSearchButtons(){
    document.getElementById("option_input").removeEventListener("input", autoComplete);
    document.getElementById("top-options").innerHTML = "";
}

//generates the suggestions for autocomplete
function generateSuggestions(search, buttons, inputObj, suggestionList){
    var url = getAPIBaseURL() + "/search/artist/" + search;
    fetch(url, {method: 'get'})
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        for(var i = 0; i < data.length; i++){
            suggestionList[i] = {
                artistName: data[i].artist_name,
                artistId: data[i].id
            };
            buttons[i].innerHTML = data[i].artist_name;
            buttons[i].onclick = function(){
                inputObj.value = this.innerHTML;
                //hides the suggestions this button is a part of
                this.parentElement.innerHTML = "";
            }
        }
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
    });
}

//changes length of bars and assigns their functions
function query(queryType, inputobj){
    if (queryType != "year" && queryType != "artist"){
        throw "queryType must be 'years' or 'artists'";
    }

    if(queryType == "year"){
        var input = inputobj.value;
    }else if(queryType == "artist"){
        var artist = validateArtist(inputobj);
        var input = artist.artistId;
        hideSearchButtons();
        document.getElementById("option_input").addEventListener("input", autoComplete);
    }

    var allAttributes = ['acousticness', 'danceability', 'duration', 'energy', 'loudness', 'speechiness', 'tempo', 'valence', 'popularity']

    //Assign the button actions and get the extreme songs
    var url1 = getAPIBaseURL() + '/most/songs/' + queryType + '/' + input;
	var url2 = getAPIBaseURL() + '/least/songs/' + queryType + '/' + input;
    var leastSongs = {};
		var mostSongs = {};
    Promise.all([
        fetch(url1, {method: 'get'}),
        fetch(url2, {method: 'get'})
    ]).then(function (responses) {
    	// Get a JSON object from each of the responses
    	return Promise.all(responses.map(function (response) {
    		return response.json();
    	}));
    }).then(function (data) {
        mostSongs = data[0]
        leastSongs = data[1]
        for(var i = 0; i < allAttributes.length; i ++){
            var leftBar = document.getElementById(allAttributes[i]).firstElementChild.firstElementChild;
            var rightBar = document.getElementById(allAttributes[i]).lastElementChild.firstElementChild;
            let leftSong = mostSongs[allAttributes[i]];
            let rightSong = leastSongs[allAttributes[i]];
            leftBar.addEventListener("click", function(){onBarClick(leftSong, true)});
            rightBar.addEventListener("click", function(){onBarClick(rightSong, false)});
        }

    }).catch(function (error) {
    	// if there's an error, log it
    	console.log(error);
    });

    //Assign correct length of buttons
	url1 = getAPIBaseURL() + '/most/songs/' + queryType + '/' + input;
	url2 = getAPIBaseURL() + '/least/songs/' + queryType + '/' + input;
    Promise.all([
        fetch(url1, {method: 'get'}),
        fetch(url2, {method: 'get'})
    ]).then(function (responses) {
    	// Get a JSON object from each of the responses
    	return Promise.all(responses.map(function (response) {
    		return response.json();
    	}));
    }).then(function (data) {
        attributes1 = data[0]
        attributes2 = data[1]
        for(var i = 0; i < allAttributes.length; i ++){
            var leftBar = document.getElementById(allAttributes[i]).firstElementChild.firstElementChild;
            var rightBar = document.getElementById(allAttributes[i]).lastElementChild.firstElementChild;
            var value1 = attributes1[allAttributes[i]].value;
            var value2 = attributes2[allAttributes[i]].value;
            var maxValue = Math.max(value1, value2) * Math.max(value1, value2);
            leftBar.style.width = ((value1 * value1 / maxValue) * 100) + "%";
            rightBar.style.width = ((value2 * value2 / maxValue) * 100) + "%";
        }
    }).catch(function (error) {
    	// if there's an error, log it
    	console.log(error);
    });

}

function onBarClick(songInfo, onLeft){
    var webplayer;
    if(onLeft){
        webplayer = document.getElementById("left-webplayer").firstElementChild;
    }else{
        webplayer = document.getElementById("right-webplayer").firstElementChild;
    }
    webplayer.src = "https://open.spotify.com/embed/track/" + songInfo.spotify_id;

}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}
