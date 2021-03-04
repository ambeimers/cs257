//Ann Beimers and Matthew Smith-Erb

window.onload = initialize;
var suggestions1 = [];
var suggestions2 = [];

function initialize() {
    var selection = document.getElementById("options");
    selection.addEventListener("change", onOptionChange);

    //set the defualts too
    onOptionChange();
}

//Changed the text for the input areas according to what they are searching
function onOptionChange(){
    var selection = document.getElementById("options");
    var choice = selection.value;

    var option1 = document.getElementById("option1_input");
    var option2 = document.getElementById("option2_input");
    option1.value = "";
    option2.value = "";
    var option1label = document.getElementById("option1_label");
    var option2label = document.getElementById("option2_label");

    option1label.innerHTML = choice + " 1"
    option2label.innerHTML = choice + " 2"

    if (choice == "artist"){
        option1.placeholder = "enter an artist"
        option2.placeholder = "enter an artist"
    }else{
        option1.placeholder = "enter a " + choice
        option2.placeholder = "enter a " + choice
    }

    if (choice == "year"){
        assignYearSearch();
    }else if(choice == "artist"){
        assignArtistSearch();
    }else if(choice == "song"){
        assignSongSearch();
    }
}

//Generate year list and add it
function assignYearSearch(){
    hideSearchButtons();
    var datalistBody = "";
    for (var y = 1924; y <= 2021; y++){
        datalistBody += "<option>" + y + "</option>\n";
    }
    var year1Datalist = document.getElementById("year1");
    var year2Datalist = document.getElementById("year2");

    year1Datalist.innerHTML = datalistBody;
    year2Datalist.innerHTML = datalistBody;

    var year1input = document.getElementById("option1_input");
    var year2input = document.getElementById("option2_input");
    document.getElementById("go").onclick = function(){query("year", year1input, year2input)};
}

//Hides the year datalist
function hideYearSearch(){
    document.getElementById("year1").innerHTML = "";
    document.getElementById("year2").innerHTML = "";
}

//creates autocomplete for artists
function assignArtistSearch(){
    hideYearSearch();
    //don't double add the event
    document.getElementById("option1_input").removeEventListener("input", autoComplete);
    document.getElementById("option2_input").removeEventListener("input", autoComplete);
    document.getElementById("option1_input").addEventListener("input", autoComplete);
    document.getElementById("option2_input").addEventListener("input", autoComplete);

    var artist1_input = document.getElementById("option1_input");
    var artist2_input = document.getElementById("option2_input");
    document.getElementById("go").onclick = function(){query("artist", artist1_input, artist2_input)}
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
        if(this.id == "option1_input"){
            generateSuggestions(this.value, searchButtons, this, suggestions1);
        }else if(this.id == "option2_input"){
            generateSuggestions(this.value, searchButtons, this, suggestions2);
        }

    }
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

function validateArtist(inputObj){
    var artistName = inputObj.value;
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
        if (artistName == suggestions[i].artistName){
            return suggestions[i]
        }
    }

    alert(artistName + " is not a valid artist");
    throw "invalid artist";
}

//INCOMPLETE
function assignSongSearch(){
    hideYearSearch();
}

function hideSearchButtons(){
    document.getElementById("option1_input").removeEventListener("input", autoComplete);
    document.getElementById("option2_input").removeEventListener("input", autoComplete);
    document.getElementById("top-options1").innerHTML = "";
    document.getElementById("top-options2").innerHTML = "";
}

//changes length of bars and assigns their functions
function query(queryType, input1obj, input2obj){
    if (queryType != "year" && queryType != "artist"){
        throw "queryType must be 'songs' or 'artists'";
    }

    if(queryType == "year"){
        var input1 = input1obj.value;
        var input2 = input2obj.value;
        document.getElementById("left-label").innerHTML = input1;
        document.getElementById("right-label").innerHTML = input2;
    }else if(queryType == "artist"){
        var artist1 = validateArtist(input1obj);
        var artist2 = validateArtist(input2obj);
        var input1 = artist1.artistId;
        var input2 = artist2.artistId;
        document.getElementById("left-label").innerHTML = artist1.artistName;
        document.getElementById("right-label").innerHTML = artist2.artistName;
        hideSearchButtons();
        document.getElementById("option1_input").addEventListener("input", autoComplete);
        document.getElementById("option2_input").addEventListener("input", autoComplete);
    }

    var allAttributes = ['acousticness', 'danceability', 'duration', 'energy', 'loudness', 'speechiness', 'tempo', 'valence', 'popularity']

    //Assign the button actions and get the extreme songs
    var url1 = getAPIBaseURL() + '/songs/' + queryType + '/' + input1;
    var url2 = getAPIBaseURL() + '/songs/' + queryType + '/' + input2;
    var songs1 = {};
    var songs2 = {};
    Promise.all([
        fetch(url1, {method: 'get'}),
        fetch(url2, {method: 'get'})
    ]).then(function (responses) {
    	// Get a JSON object from each of the responses
    	return Promise.all(responses.map(function (response) {
    		return response.json();
    	}));
    }).then(function (data) {
        songs1 = data[0]
        songs2 = data[1]
        for(var i = 0; i < allAttributes.length; i ++){
            var leftBar = document.getElementById(allAttributes[i]).firstElementChild.firstElementChild;
            var rightBar = document.getElementById(allAttributes[i]).lastElementChild.firstElementChild;
            let leftSong = songs1[allAttributes[i]];
            let rightSong = songs2[allAttributes[i]];
            leftBar.addEventListener("click", function(){onBarClick(leftSong, true)});
            rightBar.addEventListener("click", function(){onBarClick(rightSong, false)});
        }

    }).catch(function (error) {
    	// if there's an error, log it
    	console.log(error);
    });

    //Assign correct length of buttons
    url1 = getAPIBaseURL() + '/' + queryType + '/' + input1;
    url2 = getAPIBaseURL() + '/' + queryType + '/' + input2;
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
            var value1 = attributes1[allAttributes[i]];
            var value2 = attributes2[allAttributes[i]];
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
