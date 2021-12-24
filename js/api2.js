const searchButton = document.querySelector('.search-area button');
const searchField = document.querySelector('.search-area input');
const errorMsg = document.querySelector('.search-area span');

// helper functions
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function dateFormat(dateInput) {
    let date = new Date(dateInput).toDateString();
    return date.split(' ').slice(1).join(' ');
}

const availableCheck = (data, field) => {
    if (data == null || data == '') {
        field.innerHTML = 'Not Available';
        field.parentElement.classList.add('unavailable');
    } else {
        field.innerHTML = data;
    }
}

const anchorToPara = (field, textNode) => {
    let id = field.getAttribute(id);
    console.log(id);
    field.parentElement.replaceChild(document.createElement('p'),field);
    field.id = id;
    field.value = `${textNode}`;
}
const paraToAnchor = (field, textNode) => {
    let id = field.getAttribute(id);
    console.log(id);
    field.parentElement.replaceChild(document.createElement('a'),field);
    field.id = id;
    field.value = `${textNode}`;
}

// fetches data from api for given username
function fetchData(username) {
    return fetch(`https://api.github.com/users/${username}`)
        .then(handleErrors)
        .then(result => result.json())
        .then(data => renderData(data))
        .catch(error => errorMsg.setAttribute('style', 'display: inline'));

}

// search button - on click fetch data for specified username
searchButton.addEventListener('click', function() {
    if (searchField.value.length > 1) {
        fetchData(searchField.value);
        searchField.value = '';
    }
});

// if enter key pressed, click search button
searchField.addEventListener('keydown', function(event){
    if (event.keyCode === 13) {
        searchButton.click();
    }
});

// function to render data
function renderData(data) {

    // removes error message incase visible from previous search
    errorMsg.setAttribute('style', ''); 

    // render avatar
    const avatar = document.querySelector('.profile-card img');
    avatar.setAttribute('src', data.avatar_url);

    // render profile name
    const name = document.querySelector('.header-text h2');
    if (data.name == null || data.name == '') {
        name.innerHTML = data.login;
    } else {
        name.innerHTML = data.name;
    }

    // render username
    const username = document.querySelector('.header-text h3');
    username.innerHTML = data.login;

    // render join date
    const joinDate = document.querySelector('.header-text p')
    joinDate.innerHTML = `Joined ${dateFormat(data.created_at)}`;

    // render bio
    const bio = document.querySelector('.bio');
    if (data.bio == null || data.bio == '') {
        bio.innerHTML = 'This profile has no bio';
    } else {
        bio.innerHTML = data.bio;
    }
    
    // render stats section
    document.querySelector('.repos p').innerHTML = data.public_repos;
    document.querySelector('.followers p').innerHTML = data.followers;
    document.querySelector('.following p').innerHTML = data.following;

    // render links section
    const location = document.getElementById('location');
    availableCheck(data.location, location);

    const website = document.getElementById('website');
    if (data.blog == null || data.blog == '') {
        if (website.firstChild.tagName == 'A') {
            anchorToPara(website.firstChild, 'Not Available');
        } else {
            website.firstChild.innerHTML = 'Not Available';
        }
    } else {
        if (website.firstChild.tagName == 'P') {
            paraToAnchor(website.firstChild, data.blog);
        } else {
            website.firstChild.innerHTML = data.blog;
        }
        website.firstChild.setAttribute('href', data.blog);
    }

    const twitter = document.getElementById('twitter');
    if (data.twitter_username == null || data.twitter_username == '') {
        if (twitter.firstChild.tagName == 'A') {
            anchorToPara(twitter.firstChild, 'Not Available');
        } else {
            twitter.firstChild.innerHTML = 'Not Available';
        }
    } else {
        if (twitter.firstChild.tagName == 'P') {
            paraToAnchor(twitter.firstChild, data.twitter_username);
        } else {
            twitter.firstChild.innerHTML = data.twitter_username;
        }
        twitter.firstChild.setAttribute('href', `http://twitter.com/${data.twitter_username}`);
    }

    const company = document.getElementById('company');
    availableCheck(data.company, company);
}




