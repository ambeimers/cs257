/*
 * webapp.js
 * Jeff Ondich
 * 6 November 2020
 *
 * A little bit of Javascript for the tiny web app sample for CS257.
 */

window.onload = initialize;

function initialize() {
    var element = document.getElementById('search');
    if (element) {
        element.onclick = onSearchButton;
    }

    var years = []
    for (var y = 1920; y++; y < 2022){
        years.push(y);
    }
    var datalist = document.getElementById("years")
    for(var i =0; i ++; i<years.length){
        
    }
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}

function onSearchButton() {
    var year_input = document.getElementById("search_input").value
    var url = getAPIBaseURL() + '/year/' + year_input;
    alert(url)
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(attributes) {
        var listBody = '';
        listBody += '<li>' + 'acousticness:' + attributes["acousticness"] + '</li>\n';

        var attributeListElement = document.getElementById('attribute_list');
        if (attributeListElement) {
            attributeListElement.innerHTML = listBody;
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}
