const apiKey ='d8135c763a58289c458ea2f5c9b1d7a4';

const TMDBMovieFun = {};


const baseURL = 'https://api.themoviedb.org/3'
const movieRoute ='/search/movie';
const peopleRoute = '/search/person';

const movieURL = `${baseURL}${movieRoute}`
const peopleURL = `${baseURL}${peopleRoute}`
let selectedURL = undefined;


let userChoice = document.querySelector('#menuChoice').value;
console.log(userChoice);

let userSearch = document.querySelector('#userInput').value;

if (userChoice === 'title'){
    selectedURL = movieURL;
}

else if (userChoice === 'actor'){
    selectedURL = peopleURL;
}

else {
    selectedURL = undefined;
}



const url = new URL(selectedURL);
url.search = new URLSearchParams({
    api_key: apiKey,
    query: 'star'

})

fetch(url).then((response)=> {
    console.log(response.json());
})

