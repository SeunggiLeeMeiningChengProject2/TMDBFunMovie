const apiKey ='d8135c763a58289c458ea2f5c9b1d7a4';

const TMDBMovieFun = {};

const baseURL = 'https://api.themoviedb.org/3'
const basePosterURL = 'https://image.tmdb.org/t/p/w500/';
const movieRoute ='/search/movie';
const peopleRoute = '/search/person';

const movieURL = `${baseURL}${movieRoute}`
const peopleURL = `${baseURL}${peopleRoute}`
let selectedURL = undefined;


let userChoice = document.querySelector('#menuChoice').value;
console.log(userChoice);

if (userChoice === 'title'){
    selectedURL = movieURL;
}

else if (userChoice === 'actor'){
    selectedURL = peopleURL;
}

else {
    selectedURL = undefined;
}

// const testURL = 'https://api.themoviedb.org/3/search/person?api_key=d8135c763a58289c458ea2f5c9b1d7a4&language=en-US&query=cruise&page=1&include_adult=false';


//     const url = new URL(testURL);
//     fetch(url).then((response) => {
//         // console.log(response.json());
//         return response.json();
//     })
//         .then((jsonResponse) => {
//             console.log(jsonResponse);
//     })



TMDBMovieFun.getMovies = (userSearch) => {

    const url = new URL(selectedURL);
    url.search = new URLSearchParams({
        api_key: apiKey,
        query: userSearch

    })

    fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {
            console.log('hi');
            TMDBMovieFun.displayPosters(jsonResponse.results);
            console.log(jsonResponse.results);
            // for (let i=0; i<jsonResponse.results.length ;i++){
            //     console.log(jsonResponse.results[i]);
            // }


            // let movieID = jsonResponse.results[0].id;


            // let title = jsonResponse.results[0].original_title;
            // let poster = jsonResponse.results[0].poster_path;
            // let vote = jsonResponse.results[0].vote_average;



    })

}



TMDBMovieFun.displayPosters = (simpleResultArray) => {

    const gallery = document.querySelector('.gallery');

    // simpleResultArray.forEach((movie)=>{

        for (let i = 0; i < simpleResultArray.length; i++) {


            const listElement = document.createElement('li');
            

            const poster = document.createElement('img');
            poster.id = simpleResultArray[i].id;

            poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;


            listElement.append(poster);
            gallery.append(listElement);

            // Document.getElementsByClassName('i');
            // console.log(simpleResultArray);

            poster.addEventListener('click', function (event) {
            console.log("try");
            // console.log(event);
            console.log(event.target);
            const chosenMovieID = event.target.attributes[0].nodeValue;

            TMDBMovieFun.getMovieDetail(chosenMovieID);
        });

        }

        
        // TMDBMovieFun.displayDetail(movie.id);
    // });
}
// TMDBMovieFun.addEventListener = 
//TMDBMovieFun.displayDetail = (movieID) => {
TMDBMovieFun.getMovieDetail = (chosenMovieID) => {
    const detailedMovieURL = `https://api.themoviedb.org/3/movie/${chosenMovieID}`;

    const url = new URL(detailedMovieURL);
    console.log(url);
    url.search = new URLSearchParams({
        api_key: apiKey
    })

    fetch(url).then((response) => {
        return response.json();
    })
        .then((jsonResponse) => {
            
            console.log(jsonResponse);

            TMDBMovieFun.displayMovieDetail(jsonResponse);

        });
    
    
    }

TMDBMovieFun.displayMovieDetail = (movieInfo) => {
    
    document.getElementById('simpleSearch').innerHTML ="";
    
    let title = movieInfo.original_title;
    let overview = movieInfo.overview;
    let posterURL = `${basePosterURL}${movieInfo.poster_path}`;
    let release = movieInfo.release_date;
    let runtime = movieInfo.runtime;
    let vote = movieInfo.vote_average;
    console.log(overview);



    document.getElementById('simpleSearch').innerHTML =`
            <img src="${posterURL}" alt="movie poster for ${title}" class = "detailMovie">
            <h2>${title}</h2>
            <p>${overview}</p>
            <p>${release}</p>
            <p>${runtime}</p>
            <p>${vote}</p>`;
}

TMDBMovieFun.search = () => {


    document.querySelector('form').addEventListener('submit', function(event){
        event.preventDefault();
        document.getElementById('simpleSearch').innerHTML =`<ul class="gallery"></ul>`;
        let userSearch = document.querySelector('#userInput').value;
        TMDBMovieFun.getMovies(userSearch);
    })
}


TMDBMovieFun.init = () => {

    TMDBMovieFun.search();
}

TMDBMovieFun.init();