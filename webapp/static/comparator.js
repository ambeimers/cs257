//Ann Beimers and Matthew Smith-Erb

window.addEventListener("load", initializeComparator);

//persistent arrays needed for autoComplete suggestions
var suggestions1 = [];
var suggestions2 = [];

//min and max years for checking input and generating selectable years
const minYear = 1924;
const maxYear = 2021;

const allAttributes = ['acousticness', 'danceability', 'duration', 'energy', 'loudness', 'speechiness', 'tempo', 'valence', 'popularity']

//itinialize the page
function initializeComparator() {
    var selection = document.getElementById("options");
    selection.addEventListener("change", onOptionChange);

    document.addEventListener('keydown', navigateWithArrows);

    //set the defualts too
    onOptionChange();
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
    }else if(activeElement.className == "option-input" && activeElement.nextElementSibling.nextElementSibling.firstElementChild != null){
        if(key.code == "ArrowDown"){
            key.preventDefault();
            activeElement.nextElementSibling.nextElementSibling.firstElementChild.focus();
        }
    }

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

    //a vs an english correctly
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
    for (var y = minYear; y <= maxYear; y++){
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
    //add the autoComplete for artists
    document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "artist")};
    document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "artist")};

    var artist1input = document.getElementById("option1_input");
    var artist2input = document.getElementById("option2_input");
    document.getElementById("go").onclick = function(){query("artist", artist1input, artist2input)}
}

//creates autcomplete for songs
function assignSongSearch(){
    hideYearSearch();
    //add the autoComplete for songs
    document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "song")};
    document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "song")};

    var song1input = document.getElementById("option1_input");
    var song2input = document.getElementById("option2_input");
    document.getElementById("go").onclick = function(){query("song", song1input, song2input)}
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

//ensure the string in the year input is a valid year
function validateYear(input){
    if (typeof input != "string"){
        throw "input must be a string"
    }

    if(!isNaN(input)){
        var year = parseInt(input, 10);
        if(year < minYear || year > maxYear || isNaN(year)){
            alert(year + " is out of range " + minYear +" - " + maxYear);
            throw year + " is out of range " + minYear +" - " + maxYear;
        }else{
            return year;
        }
    }

    alert("You must input a valid year");
    throw "input must be a year";
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

    //fill in instructions according to the query
    var instructionPlaceholders = document.getElementsByClassName("instruction-type");
    instructionPlaceholders[1].innerHTML = queryType;
    instructionPlaceholders[2].innerHTML = queryType;
    //this is the top instructions
    if(queryType == "song"){
        instructionPlaceholders[0].innerHTML = queryType;
    }else{
        instructionPlaceholders[0].innerHTML = queryType + "'s average score for that attribute!";
    }


    //parse correct info and assign labels
    try{
        var leftLabel = document.getElementById("left-label");
        var rightLabel = document.getElementById("right-label");
        if(queryType == "year"){
            var input1 = validateYear(input1obj.value);
            var input2 = validateYear(input2obj.value);
            leftLabel.innerHTML = input1;
            rightLabel.innerHTML = input2;
        }else if(queryType == "artist"){
            var artist1 = validateInput(input1obj, "artist");
            var artist2 = validateInput(input2obj, "artist");
            var input1 = artist1.id;
            var input2 = artist2.id;
            leftLabel.innerHTML = artist1.name;
            rightLabel.innerHTML = artist2.name;
            hideSearchButtons();
            document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "artist")};
            document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "artist")};
        }else if(queryType == "song"){
            var song1 = validateInput(input1obj, "song");
            var song2 = validateInput(input2obj, "song");
            var input1 = song1.id;
            var input2 = song2.id;
            leftLabel.innerHTML = song1.name.substring(0, song1.name.length - 7);
            rightLabel.innerHTML = song2.name.substring(0, song2.name.length - 7);
            hideSearchButtons();
            document.getElementById("option1_input").oninput = function(){autoComplete(document.getElementById("option1_input"), "song")};
            document.getElementById("option2_input").oninput = function(){autoComplete(document.getElementById("option2_input"), "song")};
        }
    }catch(error){
        //catch the validation error being thrown
        console.log(error);
        return;
    }

    //make results section visible
    document.getElementById("results").style.visibility = "visible";
    document.getElementById("description").style.visibility = "visible";
    document.getElementById("results-contents").style.visibility = "visible";

    var leftInstructions = document.getElementById("left-webplayer").lastElementChild;
    var rightInstructions = document.getElementById("right-webplayer").lastElementChild;
    if(queryType == "song"){
        leftInstructions.setAttribute("hidden", true);
        rightInstructions.setAttribute("hidden", true);
    }else{
        leftInstructions.removeAttribute("hidden");
        rightInstructions.removeAttribute("hidden");
    }

    //reset webplayers to be empty
    var leftWebplayer = document.getElementById("left-webplayer").firstElementChild;
    var rightWebplayer = document.getElementById("right-webplayer").firstElementChild;
    leftWebplayer.setAttribute("hidden", true);
    rightWebplayer.setAttribute("hidden", true);
    leftWebplayer.src = "";
    rightWebplayer.src = "";

    assignDataBars(input1, input2, queryType);
    assignBarWidths(input1, input2, queryType);
}

//Assign the button actions of the databars
function assignDataBars(input1, input2, queryType){
    //set cursor to loading circle
    document.body.style.cursor = "progress";
    if(queryType == "song"){
        for(var i = 0; i < allAttributes.length; i ++){
            var leftBar = document.getElementById(allAttributes[i]).firstElementChild.firstElementChild;
            var rightBar = document.getElementById(allAttributes[i]).lastElementChild.firstElementChild;
            leftBar.onclick = function(){};
            rightBar.onclick = function(){};
        }
    }else{
        var url1 = getAPIBaseURL() + '/most/songs/' + queryType + '/' + input1;
        var url2 = getAPIBaseURL() + '/most/songs/' + queryType + '/' + input2;
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
                leftBar.onclick = function(){onBarClick(leftSong, true)};
                rightBar.onclick = function(){onBarClick(rightSong, false)};

                //set cursor back
                document.body.style.cursor = "auto";
            }
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }
}

//Assign correct length of buttons according to the respective song
function assignBarWidths(input1, input2, queryType){
    //set cursor to loading
    document.body.style.cursor = "progress";
    var url1 = getAPIBaseURL() + '/' + queryType + '/' + input1;
    var url2 = getAPIBaseURL() + '/' + queryType + '/' + input2;
    Promise.all([
        fetch(url1, {method: 'get'}),
        fetch(url2, {method: 'get'})
    ]).then(function (responses) {
    	// Get a JSON object from each of the responses
    	return Promise.all(responses.map(function (response) {
    		return response.json();
    	}));
    }).then(function (data) {
        var data1 = data[0]
        var data2 = data[1]

        //assign webplayers if this is a song query
        if(queryType == "song"){
            //assign webplayers here
            document.getElementById("left-webplayer").firstElementChild.removeAttribute("hidden")
            document.getElementById("right-webplayer").firstElementChild.removeAttribute("hidden")
            document.getElementById("left-webplayer").firstElementChild.src = "https://open.spotify.com/embed/track/" + data1.spotify_id;
            document.getElementById("right-webplayer").firstElementChild.src = "https://open.spotify.com/embed/track/" + data2.spotify_id;
        }
        for(var i = 0; i < allAttributes.length; i ++){
            var leftBar = document.getElementById(allAttributes[i]).firstElementChild.firstElementChild;
            var rightBar = document.getElementById(allAttributes[i]).lastElementChild.firstElementChild;
            var value1 = data1[allAttributes[i]];
            var value2 = data2[allAttributes[i]];
            leftBar.style.width = getWidthFromValueAttribute(value1, value2, allAttributes[i]);
            rightBar.style.width = getWidthFromValueAttribute(value2, value1, allAttributes[i]);

            colorAttributeBar(value1, value2, leftBar, rightBar);
        }
        //set cursor back
        document.body.style.cursor = "auto";
    }).catch(function (error) {
    	// if there's an error, log it
    	console.log(error);
    });
}

//colors the left and right bar of an attribute depending on which value is greater
function colorAttributeBar(value1, value2, leftBar, rightBar){
    if (value1 > value2){
        rightBar.classList.add("least-color");
        leftBar.classList.remove("least-color");
    }else{
        leftBar.classList.add("least-color");
        rightBar.classList.remove("least-color");
    }
}

//returns the width of the bar given a value, maxValue, and attributes
function getWidthFromValueAttribute(primaryValue, secondaryValue, attribute){
    if (attribute == "popularity" || attribute == "tempo" || attribute == "loudness" || attribute == "duration" ){
        var maxValue = Math.max(primaryValue, secondaryValue);
        if(attribute == "loudness"){
            return (maxValue /primaryValue * 100 + "%");
        }else{
            return (primaryValue /maxValue * 100 + "%");
        }

    }else{
        return (primaryValue * 100 + "%");
    }
}

//event for what happens when databar is clicked
function onBarClick(songInfo, onLeft){
    var webplayer;
    if(onLeft){
        webplayer = document.getElementById("left-webplayer").firstElementChild;
    }else{
        webplayer = document.getElementById("right-webplayer").firstElementChild;
    }
    webplayer.removeAttribute("hidden");
    webplayer.src = "https://open.spotify.com/embed/track/" + songInfo.spotify_id;
}

//return the url of the api we have
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}
