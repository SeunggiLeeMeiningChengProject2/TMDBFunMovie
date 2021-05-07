const apiKey = 'd8135c763a58289c458ea2f5c9b1d7a4';
const TMDBMovieFun = {};


//global variables declaring funciton
TMDBMovieFun.globalVariables = () => {
    TMDBMovieFun.baseURL = 'https://api.themoviedb.org/3'
    TMDBMovieFun.basePosterURL = 'https://image.tmdb.org/t/p/w500/';
    TMDBMovieFun.movieRoute = '/search/movie';
    TMDBMovieFun.peopleRoute = '/search/person';
    TMDBMovieFun.genreRoute = `/discover/movie`;
    TMDBMovieFun.movieURL = `${TMDBMovieFun.baseURL}${TMDBMovieFun.movieRoute}`;
    TMDBMovieFun.peopleURL = `${TMDBMovieFun.baseURL}${TMDBMovieFun.peopleRoute}`;
    TMDBMovieFun.genreURL = `${TMDBMovieFun.baseURL}${TMDBMovieFun.genreRoute}`;
    TMDBMovieFun.selectedURL = undefined;
    TMDBMovieFun.userChoice = document.querySelector('#menuChoice').value;
}


//fetch basic movie information based on title search from API
TMDBMovieFun.getMovies = (userSearch) => {
    const url = new URL(TMDBMovieFun.selectedURL);
    url.search = new URLSearchParams({
        api_key: apiKey,
        query: userSearch,
    })
    fetch(url).then((response) => {
        return response.json();
    })
        .then((jsonResponse) => {
            if (TMDBMovieFun.userChoice === "title") {
                TMDBMovieFun.movieFilter(jsonResponse.results);
            }
            else if (TMDBMovieFun.userChoice === "actor") {
                TMDBMovieFun.profileFilter(jsonResponse.results);
            }
            else {
                TMDBMovieFun.getGenreMovies();
            }
            if (jsonResponse.results.length === 0) {
                const emptyResult = document.createElement('img');
                emptyResult.className = "emptyResultImg";
                emptyResult.src = "./assets/sorry-no-results-found.png";
                emptyResult.alt = "No result found";
                const result = document.querySelector('#simpleSearch');
                result.appendChild(emptyResult);
            }
        })
}

//event listener for when user changes search type
document.querySelector('#menuChoice').addEventListener('change', () => {
    TMDBMovieFun.userChoice = document.querySelector('#menuChoice').value;
    if (TMDBMovieFun.userChoice === "genre") {
        document.querySelector('#genreChoice').className = 'showGenre';
        document.querySelector('#userInput').className = 'hideInput';
        document.querySelector('#userInput').required = false;
    } else {
        document.querySelector('#genreChoice').className = 'hideGenre';
        document.querySelector('#userInput').className = 'showInput';
        document.querySelector('#userInput').required = true;
    }
})

//fetch basic movie information based on genre search from API
TMDBMovieFun.getGenreMovies = () => {
    const url = new URL(TMDBMovieFun.selectedURL);
    let userGenreChoice = document.querySelector('#genreChoice').value;
    url.search = new URLSearchParams({
        api_key: apiKey,
        with_genres: userGenreChoice,
        sort_by: 'popularity.desc'
    })
    fetch(url).then((response) => {
        return response.json();
    })
        .then((jsonResponse) => {
            TMDBMovieFun.displayPosters(jsonResponse.results);           
        })
}

//filters movie out that does not have poster available
TMDBMovieFun.movieFilter = (simpleResultArray) => {
    TMDBMovieFun.simpleResultArrayFiltered = simpleResultArray.filter((item) => {
        return item.poster_path;
    })
    TMDBMovieFun.displayPosters(TMDBMovieFun.simpleResultArrayFiltered);
}

//filters profiles out that does not have profile photo available
TMDBMovieFun.profileFilter = (simpleResultArray) => {
    TMDBMovieFun.simpleResultArrayFiltered = simpleResultArray.filter((item) => {
        return item.profile_path;
    })
    TMDBMovieFun.displayProfile(TMDBMovieFun.simpleResultArrayFiltered);
}

//append movie info on search result section
TMDBMovieFun.displayPosters = (simpleResultArray) => {
    const gallery = document.querySelector('.gallery');
    for (let i = 0; i < simpleResultArray.length; i++) {
        const listElement = document.createElement('li');
        const poster = document.createElement('img');
        const rating = document.createElement('div');
        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].title;
        poster.id = simpleResultArray[i].id;
        poster.src = `${TMDBMovieFun.basePosterURL}${simpleResultArray[i].poster_path}`;
        poster.alt = `the poster for ${simpleResultArray[i].title}`;

        let vote = simpleResultArray[i].vote_average;
        rating.innerHTML = `<i class="fas fa-star"></i> <span>${vote}</span>`;
        
        TMDBMovieFun.addPlusButton(simpleResultArray, i, listElement, gallery, poster, rating, description);
    }
}

//add a plus button that adds movies to to-watch-list
TMDBMovieFun.addPlusButton = (simpleResultArray, i, listElement, gallery, poster, rating, description) => {
    const plusButton = document.createElement('button');
    plusButton.className = `toWatchButton`;
    plusButton.id = simpleResultArray[i].title;
    plusButton.innerHTML = '<i class="fas fa-plus"></i>';
    listElement.appendChild(plusButton);
    listElement.append(poster);
    listElement.appendChild(rating);
    listElement.appendChild(description);
    gallery.append(listElement);
    poster.addEventListener('click', function (event) {
        const chosenMovieID = event.target.attributes[0].nodeValue;
        TMDBMovieFun.getMovieDetail(chosenMovieID);
    });

    plusButton.addEventListener('click', function () {
        const movieName = this.attributes[1].value;
        TMDBMovieFun.addWatchList(movieName);
    });
}

//when plus button is clicked, add that movie to to-watch-list
TMDBMovieFun.addWatchList = (movieName) => {
    const movieList = document.createElement('li');
    const toWatchList = document.querySelector('.toWatchList');
    movieList.textContent = movieName;
    const movieLis = document.querySelectorAll('.toWatchBar li')
    for (movieLi of movieLis) {
        if (movieName === movieLi.textContent){
            alert('The movie is already in your list!');
            return;
        }
    }
    toWatchList.appendChild(movieList);
}

//fetch detailed movie info from API 
TMDBMovieFun.getMovieDetail = (chosenMovieID) => {
    const detailedMovieURL = `https://api.themoviedb.org/3/movie/${chosenMovieID}`;
    const url = new URL(detailedMovieURL);
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

//fetch detailed profile info from API
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
            TMDBMovieFun.displayProfileDetail(jsonResponse);
        });
}

//append fetched detailed movie info on result section
TMDBMovieFun.displayMovieDetail = (movieInfo) => {
    document.getElementById('simpleSearch').innerHTML = "";
    let title = movieInfo.title;
    let overview = movieInfo.overview;
    let posterURL = `${TMDBMovieFun.basePosterURL}${movieInfo.poster_path}`;
    let release = movieInfo.release_date;
    let runtime = movieInfo.runtime;
    let vote = movieInfo.vote_average;
    document.getElementById('simpleSearch').innerHTML = `
            <img src="${posterURL}" alt="movie poster for ${title}" class = "detailMovie">
            <i class="fas fa-star"></i><span>${vote}</span>
            <h2>${title}</h2>
            <p>Release date: ${release}</p>
            <p>Runtime: ${runtime} minutes</p>
            <p>${overview}</p>`;
    document.getElementById("simpleSearch").scrollIntoView({behavior: 'smooth'});
}

// appened fetched profile info to result section
TMDBMovieFun.displayProfile = (simpleResultArray) => {
    const gallery = document.querySelector('.gallery');

    for (let i = 0; i < simpleResultArray.length; i++) {

        const listElement = document.createElement('li');
        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].name;
        const profile = document.createElement('img');
        profile.id = simpleResultArray[i].id;
        profile.src = `${TMDBMovieFun.basePosterURL}${simpleResultArray[i].profile_path}`;
        profile.alt = `the photo for ${simpleResultArray[i].name}`

        listElement.append(profile);
        listElement.appendChild(description);
        gallery.append(listElement);

        profile.addEventListener('click', function (event) {
        const chosenProfile = event.target.attributes[0].nodeValue;
        TMDBMovieFun.getProfileDetail(chosenProfile)
        });
    }
}

// appened fetched detailed profile info to result section
TMDBMovieFun.displayProfileDetail = (profileInfo) => {

    document.getElementById('simpleSearch').innerHTML = "";
    let name = profileInfo.name;
    let birthday = profileInfo.birthday;
    let profilePhoto = `${TMDBMovieFun.basePosterURL}${profileInfo.profile_path}`;
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


//search function
TMDBMovieFun.search = () => {

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        document.getElementById('simpleSearch').innerHTML = `<ul class="gallery"></ul>`;
        let userSearch = document.querySelector('#userInput').value;

        if (TMDBMovieFun.userChoice === 'title') {
            TMDBMovieFun.selectedURL = TMDBMovieFun.movieURL;
        }

        else if (TMDBMovieFun.userChoice === 'actor') {
            TMDBMovieFun.selectedURL = TMDBMovieFun.peopleURL;
        }

        else {
            TMDBMovieFun.selectedURL = TMDBMovieFun.genreURL;
        }

        TMDBMovieFun.getMovies(userSearch);

        //clear the input
        document.querySelector('#userInput').value ="";

    })
}

//fetches featured movies info from API and "await" for slick library to kick in
TMDBMovieFun.getFeaturedMovies = async function (featuredURL) {
    
    const url = new URL(featuredURL);

    url.search = new URLSearchParams({
        api_key: apiKey,
        sort_by: 'popularity.desc'
    })
    await fetch(url).then((response) => {
        return response.json();
    })
        .then((jsonResponse) => {
            TMDBMovieFun.displayFeaturedMovies(jsonResponse.results);
        })
}

//displays featured movies in carousel
TMDBMovieFun.displayFeaturedMovies = (simpleResultArray) => {
    const featuredList = document.querySelector('.responsive');

    for (let i = 0; i < simpleResultArray.length; i++) {
        const listElement = document.createElement('li');

        const divElement = document.createElement('div');
        divElement.className = 'movieContainer';

        const poster = document.createElement('img');
        featuredList.append(listElement);

        const description = document.createElement('p');
        description.textContent = simpleResultArray[i].title;

        poster.id = simpleResultArray[i].id;

        poster.src = `${TMDBMovieFun.basePosterURL}${simpleResultArray[i].poster_path}`;
        poster.alt = `the poster for ${simpleResultArray[i].title}`;

        const plusButton = document.createElement('button');
        plusButton.className = `toWatchButton`;
        plusButton.id = simpleResultArray[i].title;
        plusButton.innerHTML = '<i class="fas fa-plus"></i>';
        
        listElement.appendChild(divElement);

        divElement.appendChild(plusButton);
        divElement.append(poster);
        divElement.appendChild(description);


        poster.addEventListener('click', function (event) {
            const chosenMovieID = event.target.attributes[0].nodeValue;
            TMDBMovieFun.getMovieDetail(chosenMovieID);
        });

        plusButton.addEventListener('click', function () {
            const movieName = this.attributes[1].value;
            TMDBMovieFun.addWatchList(movieName);
        });
    }
}

//removes added movie from to-watch-list
TMDBMovieFun.removeToWatchList = () => {
    const toWatchList = document.querySelector('.toWatchList');
    toWatchList.addEventListener('click', (event)=> {
        const removeItem = event.target;
        removeItem.remove();
    }) 
}


TMDBMovieFun.init = () => {

TMDBMovieFun.globalVariables();
TMDBMovieFun.removeToWatchList();
TMDBMovieFun.getFeaturedMovies(TMDBMovieFun.genreURL).then(()=>{

// credit to Slick library: "https://kenwheeler.github.io/slick/"
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
                breakpoint: 730,
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

