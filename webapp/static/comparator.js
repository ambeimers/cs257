//Ann Beimers and Matthew Smith-Erb

window.onload = initialize;

function initialize() {
    var selection = document.getElementById("options");
    selection.addEventListener("change", onOptionChange);
}

//Changed the text for the input areas according to what they are searching
function onOptionChange(){
    var selection = document.getElementById("options");
    var choice = selection.value;

    var option1 = document.getElementById("option1_input");
    var option2 = document.getElementById("option2_input");
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
    }
}

//Generate year list and add it
function assignYearSearch(){
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
    document.getElementById("go").addEventListener("click", function(){query("year", year1input, year2input)})
}

function assignArtistSearch(){
    
}

//changes length of bars and assigns their functions
function query(queryType, input1obj, input2obj){
    if (queryType != "year" && queryType != "artist"){
        throw "queryType must be 'songs' or 'artists'";
    }

    if(queryType == "year"){
        var input1 = input1obj.value;
        var input2 = input2obj.value;
    }
    document.getElementById("left-label").innerHTML = input1;
    document.getElementById("right-label").innerHTML = input2;
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
        console.log(songs1);
        console.log(songs2);
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
            console.log("doing stuff");
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
