//Ann Beimers and Matthew Smith-Erb

window.onload = initialize;

function initialize() {
    var element = document.getElementById('search');
    if (element) {
        element.onclick = onSearchButton;
    }
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function onSearchButton() {
    var year_input = document.getElementById("search_input").value
    var url = getAPIBaseURL() + '/year/' + year_input;
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(attributes) {
        var listBody = '';
        listBody +=
				'<li>' + 'Year: ' + attributes["year"] + '</li>\n'
				+ '<li>' + 'Acousticness: ' + attributes["acousticness"] + '</li>\n'
				+ '<li>' + 'Danceability: ' + attributes["danceability"] + '</li>\n'
				+ '<li>' + 'Duration (ms): ' + attributes["duration"] + '</li>\n'
				+ '<li>' + 'Energy: ' + attributes["energy"] + '</li>\n';

        var attributeListElement = document.getElementById('attribute_list');
        if (attributeListElement) {
            attributeListElement.innerHTML = listBody;
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}
