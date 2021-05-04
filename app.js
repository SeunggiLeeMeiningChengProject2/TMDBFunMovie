const apiKey = 'd8135c763a58289c458ea2f5c9b1d7a4';

const TMDBMovieFun = {};

const baseURL = 'https://api.themoviedb.org/3'
const basePosterURL = 'https://image.tmdb.org/t/p/w500/';
const movieRoute = '/search/movie';
const peopleRoute = '/search/person';

const genreRoute = `/discover/movie`

const movieURL = `${baseURL}${movieRoute}`
const peopleURL = `${baseURL}${peopleRoute}`
const genreURL = `${baseURL}${genreRoute}`

let selectedURL = undefined;


TMDBMovieFun.getMovies = (userSearch) => {

    const url = new URL(selectedURL);


    url.search = new URLSearchParams({
        api_key: apiKey,
        query: userSearch,

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
                // let genreChoice = document.querySelector('#genreChoice').value;
                TMDBMovieFun.getGenreMovies();


                // TMDBMovieFun.displayGenreMovies();
                // console.log("genere")
            }
            console.log("hi");
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

document.querySelector('#menuChoice').addEventListener('change', () => {
    let userChoice = document.querySelector('#menuChoice').value;
    if (userChoice === "genre") {
        document.querySelector('#genreChoice').className = 'showGenre';
    } else {
        document.querySelector('#genreChoice').className = 'hideGenre';
    }
})


TMDBMovieFun.getGenreMovies = () => {
    const url = new URL(selectedURL);
    console.log(selectedURL);
    let userGenreChoice = document.querySelector('#genreChoice').value;

    console.log(userGenreChoice);
    url.search = new URLSearchParams({
        api_key: apiKey,
        with_genres: userGenreChoice,
        sort_by: 'popularity.desc'
    })

    console.log(url);

    fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {
            console.log('hi');
            console.log(jsonResponse.results);
            TMDBMovieFun.displayGenreMovies(jsonResponse.results);
            // console.log("genere")
        })

}




TMDBMovieFun.displayGenreMovies = (simpleResultArray) => {
    const gallery = document.querySelector('.gallery');
    // simpleResultArray.forEach((movie)=>{
    for (let i = 0; i < simpleResultArray.length; i++) {
        const listElement = document.createElement('li');
        const poster = document.createElement('img');

        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].title;

        poster.id = simpleResultArray[i].id;

        poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;
        poster.alt = `the poster for ${simpleResultArray[i].name}`

        listElement.append(poster);
        listElement.appendChild(description);
        gallery.append(listElement);

        poster.addEventListener('click', function (event) {
            const chosenMovieID = event.target.attributes[0].nodeValue;
            TMDBMovieFun.getMovieDetail(chosenMovieID);

        });

    }

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

        const rating = document.createElement('div');
        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].title;

        poster.id = simpleResultArray[i].id;

        poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;
        poster.alt = `the poster for ${simpleResultArray[i].title}`;

        let vote = simpleResultArray[i].vote_average;
        rating.innerHTML = `<i class="fas fa-star"></i> <span>${vote}</span>`;
        


        const plusButton = document.createElement('button');
        plusButton.className = `toWatchButton`;
        plusButton.id = simpleResultArray[i].title;
        plusButton.innerHTML = '<i class="fas fa-plus-circle"></i>';
        listElement.appendChild(plusButton);


        listElement.append(poster);
        listElement.appendChild(rating);
        listElement.appendChild(description);
        gallery.append(listElement);
        poster.addEventListener('click', function (event) {
            console.log(event.target);
            const chosenMovieID = event.target.attributes[0].nodeValue;

            TMDBMovieFun.getMovieDetail(chosenMovieID);
        });

        plusButton.addEventListener('click', function () {
            const movieName = this.attributes[1].value;
            console.log(this);
            TMDBMovieFun.addWatchList(movieName);
        });

    }
}

TMDBMovieFun.addWatchList = (movieName) => {

    const movieList = document.createElement('li');
    const toWatchList = document.querySelector('.toWatchList');
    movieList.textContent = movieName;
    toWatchList.appendChild(movieList);


}



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

    document.getElementById('simpleSearch').innerHTML = "";

    let title = movieInfo.title;
    let overview = movieInfo.overview;
    let posterURL = `${basePosterURL}${movieInfo.poster_path}`;
    let release = movieInfo.release_date;
    let runtime = movieInfo.runtime;
    let vote = movieInfo.vote_average;
    console.log(overview);



    document.getElementById('simpleSearch').innerHTML = `
            <img src="${posterURL}" alt="movie poster for ${title}" class = "detailMovie">
            <i class="fas fa-star"></i><span>${vote}</span>
            <h2>${title}</h2>
            <p>Release date: ${release}</p>
            <p>Runtime: ${runtime} minutes</p>
            <p>${overview}</p>`;


            document.getElementById("simpleSearch").scrollIntoView({behavior: 'smooth'});
}


TMDBMovieFun.displayProfile = (simpleResultArray) => {
    const gallery = document.querySelector('.gallery');

    for (let i = 0; i < simpleResultArray.length; i++) {


        const listElement = document.createElement('li');

        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].name;
        const profile = document.createElement('img');
        profile.id = simpleResultArray[i].id;
        profile.src = `${basePosterURL}${simpleResultArray[i].profile_path}`;
        profile.alt = `the photo for ${simpleResultArray[i].name}`



        listElement.append(profile);
        listElement.appendChild(description);
        gallery.append(listElement);

        profile.addEventListener('click', function (event) {
            console.log(event.target);

            const chosenProfile = event.target.attributes[0].nodeValue;
            TMDBMovieFun.getProfileDetail(chosenProfile)



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
    else if (gender === 2) {
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

    console.log("biography");
    console.log(biography);


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


            document.getElementById("simpleSearch").scrollIntoView({behavior: 'smooth'});

}



TMDBMovieFun.search = () => {


    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('simpleSearch').innerHTML = `<ul class="gallery"></ul>`;
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
            selectedURL = genreURL;
        }

        TMDBMovieFun.getMovies(userSearch);

    })
}


TMDBMovieFun.getFeaturedMovies = async function (featuredURL) {
    
    const url = new URL(featuredURL);

    url.search = new URLSearchParams({
        api_key: apiKey,
        sort_by: 'popularity.desc'
    })
    await fetch(url).then((response) => {
        // console.log(response.json());
        return response.json();
    })
        .then((jsonResponse) => {
            TMDBMovieFun.displayFeaturedMovies(jsonResponse.results);
            // console.log("genere")
        })
}

TMDBMovieFun.displayFeaturedMovies = (simpleResultArray) => {
    const featuredList = document.querySelector('.responsive');

    for (let i = 0; i < simpleResultArray.length; i++) {
        const listElement = document.createElement('li');
        const poster = document.createElement('img');
        featuredList.append(listElement);

        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].title;

        poster.id = simpleResultArray[i].id;

        poster.src = `${basePosterURL}${simpleResultArray[i].poster_path}`;
        poster.alt = `the poster for ${simpleResultArray[i].title}`;


        const plusButton = document.createElement('button');
        plusButton.className = `toWatchButton`;
        plusButton.id = simpleResultArray[i].title;
        plusButton.innerHTML = '<i class="fas fa-plus-circle"></i>';
        listElement.appendChild(plusButton);


        listElement.append(poster);
        listElement.appendChild(description);


        poster.addEventListener('click', function (event) {
            // console.log("try");
            // console.log(event);
            console.log(event.target);
            const chosenMovieID = event.target.attributes[0].nodeValue;
            TMDBMovieFun.getMovieDetail(chosenMovieID);

            

        });

        plusButton.addEventListener('click', function () {
            const movieName = this.attributes[1].value;
            console.log(this);
            TMDBMovieFun.addWatchList(movieName);
        });

    }
}


TMDBMovieFun.init = () => {

    
TMDBMovieFun.getFeaturedMovies(genreURL).then(()=>{

$('.responsive').slick({
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 6,
        responsive: [
            {
                breakpoint: 1240,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 895,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

});

TMDBMovieFun.search();



}

TMDBMovieFun.init();


$(document).ready(function () {


    
});

