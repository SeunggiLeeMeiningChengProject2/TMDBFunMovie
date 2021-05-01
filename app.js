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


TMDBMovieFun.getMovies = () => {

    const url = new URL(selectedURL);
    url.search = new URLSearchParams({
        api_key: apiKey,
        query: 'star'

    })

    fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {

            TMDBMovieFun.displayPosters(jsonResponse.results);
            console.log(jsonResponse);
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

            const basePosterURL = "https://image.tmdb.org/t/p/w500/";

            poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;


            listElement.append(poster);
            gallery.append(listElement);

            // Document.getElementsByClassName('i');
            // console.log(simpleResultArray);

            

        }

        document.querySelectorAll('img').addEventListener('click', function (event) {
            console.log("try");
            // console.log(event);
            console.log(event.target);
            const chosenMovieID = event.target.attributes[0].nodeValue;

            TMDBMovieFun.getMovieDetail(chosenMovieID);
        });

        

        // TMDBMovieFun.displayDetail(movie.id);



    // });
}


// TMDBMovieFun.addEventListener = 


// TMDBMovieFun.displayDetail = (movieID) => {

TMDBMovieFun.getMovieDetail = (chosenMovieID) => {
    const detailedMovieURL = `https://api.themoviedb.org/3/movie/${chosenMovieID}`;

    const url = new URL(detailedMovieURL);
    console.log(url);
    url.search = new URLSearchParams({
        
    
        api_key: apiKey

    })

    fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {
            TMDBMovieFun.displayPosters(jsonResponse.results);
            console.log(jsonResponse);

        })
    
    
    }
// }




TMDBMovieFun.init = () => {
    TMDBMovieFun.getMovies();
}

TMDBMovieFun.init();