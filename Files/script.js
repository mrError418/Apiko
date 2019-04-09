"use strict";

function search() {

    document.getElementById('similarFilms').innerHTML = displayViewList(getSearchResult(document.getElementById('searchValue').value));
    document.getElementById('hiddenDiv').innerHTML = '<h2>Search result</h2>';
}

document.addEventListener("DOMContentLoaded", onPageLoad);

function onPageLoad() {
    document.getElementById('similarFilms').innerHTML = displayViewList(getTopFilms());
    document.getElementById('similarFilms').style.visibility = 'visible';
    document.getElementById('hiddenDiv').innerHTML = '<h2>Top Films</h2>';
    document.getElementById('hiddenDiv').style.visibility = 'visible';
}

function addFilmToPage(filmId) {
    let somefilmId = filmId? filmId:42297;
    let div = document.getElementById('content');
    let previous = JSON.parse(JSON.stringify(div.innerHTML));

    document.getElementById('filmDescribe').innerHTML = getVieWCurrentFilm(somefilmId);
    document.getElementById('similarFilms').innerHTML = displayViewList(getSimilarFilms(somefilmId));

    document.getElementById('filmDescribe').style.visibility = 'visible';
    document.getElementById('hiddenDiv').innerHTML = '<h2>Similar Movies</h2>';
    document.getElementById('similarFilms').style.visibility = 'visible';
}


function getVieWCurrentFilm(somefilmId) {
    let data = JSON.parse(getFilmById(somefilmId));
    return `
        <h1>${data['original_title']}</h1>
            <img src="https://image.tmdb.org/t/p/w500/${data['backdrop_path']}" alt="Picture of ${data['original_title']}" align="left" style="width: 40%; margin-right: 3%">
             <p>Original Title - ${data['original_title']}  </p>
             <p>Budget - ${data['budget'] ? data['budget'] : 'none'}  </p>
             <p>Genres - ${data['genres']['name'] ? data['genres']['name'] : 'none'} </p>
             <p>Overview: <br>${data['overview']}  </p>
    `;
}


function displayViewList(value) {
    let dataSimilarFilms = JSON.parse(value);
    let similarFilm = '';
    for (let i = 0; i < 5; i++) {
        similarFilm += `
        <span>
        <img src="https://image.tmdb.org/t/p/w500${dataSimilarFilms['results'][i]['backdrop_path']}" align="left" style="margin: auto  ;width: 40%; height: 100px; margin-right: 3%">
        <a href="#" id="${dataSimilarFilms['results'][i]['id']}" onclick="addFilmToPage(this.id)"><h5> ${dataSimilarFilms['results'][i]['original_title']}</h5></a>
        <p>${dataSimilarFilms['results'][i]['overview'].substring(0, 255)}...</p>
        </span>        
        `;
    }
    return similarFilm;
}

function getSearchResult(value) {
    // alert ('dsdf'+value);
    return getDataByRequest(`https://api.themoviedb.org/3/search/movie?api_key=5df016eb27a8335622d6e7361330d998&language=en-US&query=${value}&page=1&include_adult=false`);
}

function getTopFilms() {
    return getDataByRequest('https://api.themoviedb.org/3/trending/all/day?api_key=5df016eb27a8335622d6e7361330d998');
}

function getSimilarFilms(id) {
    return getDataByRequest(id ? 'https://api.themoviedb.org/3/movie/' + id + '/similar?api_key=5df016eb27a8335622d6e7361330d998&language=en-US&page=1' : 'https://api.themoviedb.org/3/movie/429/similar?api_key=5df016eb27a8335622d6e7361330d998&language=en-US&page=1')
}

function getFilmById(id) {
    let url = 'https://api.themoviedb.org/3/movie/429?api_key=5df016eb27a8335622d6e7361330d998&language=en-US';
    return (id) ? getDataByRequest(`https://api.themoviedb.org/3/movie/${id}?api_key=5df016eb27a8335622d6e7361330d998&language=en-US`) : getDataByRequest(url);
}

function getDataByRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    if (xhr.status != 200) {
            alert('seems something wrong');
    } else{
        if(xhr.responseText ==='{"page":1,"total_results":0,"total_pages":1,"results":[]}')
            alert('There no films by those parametr');
        return xhr.responseText;
    }
}