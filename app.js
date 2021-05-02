const apiKey ='d8135c763a58289c458ea2f5c9b1d7a4';

const TMDBMovieFun = {};

const baseURL = 'https://api.themoviedb.org/3'
const basePosterURL = 'https://image.tmdb.org/t/p/w500/';
const movieRoute ='/search/movie';
const peopleRoute = '/search/person';

const movieURL = `${baseURL}${movieRoute}`
const peopleURL = `${baseURL}${peopleRoute}`
let selectedURL = undefined;




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

    console.log(url);

    fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {
            console.log('hi');


            let userChoice = document.querySelector('#menuChoice').value;

            if (userChoice === "title") {
                TMDBMovieFun.movieFilter(jsonResponse.results);
            }
            else if (userChoice === "actor") {
                TMDBMovieFun.profileFilter(jsonResponse.results);
            }
            else {
                console.log("genere")
            }

            


            
            // TMDBMovieFun.displayPosters(jsonResponse.results);
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


TMDBMovieFun.movieFilter = (simpleResultArray) => {

    TMDBMovieFun.simpleResultArrayFiltered = simpleResultArray.filter((item) => {
        return item.poster_path;
    })

    TMDBMovieFun.displayPosters(TMDBMovieFun.simpleResultArrayFiltered);
    
}


TMDBMovieFun.profileFilter = (simpleResultArray) => {
    TMDBMovieFun.simpleResultArrayFiltered = simpleResultArray.filter((item) => {
        return item.profile_path;
    })

    TMDBMovieFun.displayProfile(TMDBMovieFun.simpleResultArrayFiltered);
}


TMDBMovieFun.displayPosters = (simpleResultArray) => {

    const gallery = document.querySelector('.gallery');

    // simpleResultArray.forEach((movie)=>{

        for (let i = 0; i < simpleResultArray.length; i++) {


            const listElement = document.createElement('li');
            

            const poster = document.createElement('img');
            poster.id = simpleResultArray[i].id;

            if (simpleResultArray[i].poster_path === null) {
                poster.src = `https://www.movienewz.com/img/films/poster-holder.jpg`;
                
            } else {
                poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;
            }

            listElement.append(poster);
            gallery.append(listElement);

            // Document.getElementsByClassName('i');
            // console.log(simpleResultArray);

            poster.addEventListener('click', function (event) {
            // console.log("try");
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

    TMDBMovieFun.getProfileDetail = (profileDetail) => {
    const detailedProfileURL = `https://api.themoviedb.org/3/person/${profileDetail}`;
    const url = new URL(detailedProfileURL);
    url.search = new URLSearchParams({
        api_key: apiKey
    })

    fetch(url).then((response) => {
        return response.json();
    })
        .then((jsonResponse) => {
            
            console.log(jsonResponse);

            TMDBMovieFun.displayProfileDetail(jsonResponse);

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


TMDBMovieFun.displayProfile = (simpleResultArray) => {
    const gallery = document.querySelector('.gallery');

    // simpleResultArray.forEach((movie)=>{

    for (let i = 0; i < simpleResultArray.length; i++) {


        const listElement = document.createElement('li');


        const profile = document.createElement('img');
        profile.id = simpleResultArray[i].id;

        if (simpleResultArray[i].profile_path === null) {
            profile.src = `https://www.movienewz.com/img/films/poster-holder.jpg`;
            
        } else {
            profile.src = `${basePosterURL}${simpleResultArray[i].profile_path}`;
        }

        listElement.append(profile);
        gallery.append(listElement);

        // Document.getElementsByClassName('i');
        // console.log(simpleResultArray);

        profile.addEventListener('click', function (event) {
            // console.log("try");
            // console.log(event);
            console.log(event.target);

            const chosenProfile = event.target.attributes[0].nodeValue;
            console.log(chosenProfile);
            TMDBMovieFun.getProfileDetail(chosenProfile)
            // const chosenMovieID = event.target.attributes[0].nodeValue;

            // TMDBMovieFun.getMovieDetail(chosenMovieID);

            
        });

    }
}


TMDBMovieFun.displayProfileDetail = (profileInfo) => {

    document.getElementById('simpleSearch').innerHTML = "";

    let name = profileInfo.name;
    let birthday = profileInfo.birthday;
    let profilePhoto = `${basePosterURL}${profileInfo.profile_path}`;
    let gender = profileInfo.gender;
    
    if (gender === 1) {
        gender = "female";
    }
    else if (gender === 2){
        gender = "male";
    }
    else {
        gender = "not available"
    }
    let biography = profileInfo.biography;
    let placeOfBirth = profileInfo.place_of_birth;
    if (placeOfBirth === null) {
        placeOfBirth = "not available"
    }

    
    // let knownMovies = [knownForArray[0].original_title, knownForArray[1].original_title, knownForArray[2].original_title];
    // let knownForArray = profileInfo.known_for;
    // console.log(profileInfo);
    // console.log(knownForArray);
    // knownForArray.forEach((movie) => {
    //     return movie.original_title
    // });

    document.getElementById('simpleSearch').innerHTML = `
            <img src="${profilePhoto}" alt="profile picture for ${name}" class = "detailMovie">
            <h2>${name}</h2>
            <p>gender: ${gender}</p>
            <p>birth date: ${birthday}</p>
            <p>place of birth: ${placeOfBirth}</p>
            <p>${biography}</p>
            `;

}








TMDBMovieFun.search = () => {


    document.querySelector('form').addEventListener('submit', function(event){
        event.preventDefault();
        document.getElementById('simpleSearch').innerHTML =`<ul class="gallery"></ul>`;
        let userSearch = document.querySelector('#userInput').value;

        let userChoice = document.querySelector('#menuChoice').value;
        console.log(userChoice);

        if (userChoice === 'title') {
            selectedURL = movieURL;
        }

        else if (userChoice === 'actor') {
            selectedURL = peopleURL;
        }

        else {
            selectedURL = undefined;
        }

        TMDBMovieFun.getMovies(userSearch);
        
    })
}


TMDBMovieFun.init = () => {

    TMDBMovieFun.search();
}

TMDBMovieFun.init();