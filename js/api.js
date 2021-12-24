const searchButton = document.querySelector('.search-area button');
const searchField = document.querySelector('.search-area input');
const errorMsg = document.querySelector('.search-area span');

/* ---------------------------- 
------ HELPER FUNCTIONS -------
----------------------------- */

function formatDate(dateInput) { 
    let date = new Date(dateInput).toDateString();
    return date.split(' ').slice(1).join(' '); 
}

const createPara = (field, textNode) => {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(`${textNode}`));
    field.parentElement.replaceChild(p, field);
}

const createAnchor = (field, textNode) => {
    const a = document.createElement('a');
    a.appendChild(document.createTextNode(`${textNode}`));
    field.parentElement.replaceChild(a, field);
}

const renderPara = (field, data, textNode = 'Not Available') => {
    if (data == null || data == '') {
        field.innerHTML = `${textNode}`;
        field.parentNode.classList.add('unavailable');
    } else if (field.parentElement.classList.contains('unavailable')) {
        field.innerHTML = data;
        field.parentNode.classList.remove('unavailable');
    } else {
        field.innerHTML = data;
    }
}

/* ---------------------------- 
------ API FUNCTIONS ---------
----------------------------- */

// if http response code not in sucessful range, throws error
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// fetches data from api for given username
function fetchData(username) {
    return fetch(`https://api.github.com/users/`+username)
        .then(handleErrors)
        .then(result => result.json())
        .then(data => renderData(data))
        .catch(error => errorMsg.setAttribute('style', 'display: inline'));
        
}

/* ---------------------------- 
------ SEARCH BUTTON ----------
----------------------------- */

// on click fetch data for specified username
searchButton.addEventListener('click', function() {
    fetchData(searchField.value);
});

// if enter key pressed, click search button
searchField.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        searchButton.click();
    }
});

/* ---------------------------- 
------ RENDER FUNCTION- -------
----------------------------- */

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
    document.querySelector('.header-text h3').innerHTML = data.login;

    // render join date
    document.getElementById('join-date').innerHTML = `Joined ${formatDate(data.created_at)}`;

    // render bio
    const bio = document.querySelector('.bio p');
    renderPara(bio, data.bio, 'This profile has no bio');
    
    // render stats section
    document.querySelector('.repos p').innerHTML = data.public_repos;
    document.querySelector('.followers p').innerHTML = data.followers;
    document.querySelector('.following p').innerHTML = data.following;

    // render links section
    const location = document.querySelector('.location p');
    renderPara(location, data.location);

    let website = document.querySelector('.website span').firstChild;
    if (data.blog == null || data.blog == '') {
        createPara(website, 'Not Available');
        document.querySelector('.website').classList.add('unavailable');
    } else if (website.tagName == 'P') {
        createAnchor(website, data.blog);
        website = document.querySelector('.website span').firstChild;
        document.querySelector('.website').classList.remove('unavailable');
        website.href = data.blog;
    } else if (website.tagName == 'A') {
        website.innerHTML = data.blog;
        website.href = data.blog;
    }

    let twitter = document.querySelector('.twitter span').firstChild;
    if (data.twitter_username == null || data.twitter_username == '') {
        createPara(twitter, 'Not Available');
        document.querySelector('.twitter').classList.add('unavailable');
    } else if (twitter.tagName == 'P') {
        createAnchor(twitter, data.twitter_username);
        twitter = document.querySelector('.twitter span').firstChild;
        document.querySelector('.twitter').classList.remove('unavailable');
        twitter.href = 'http://twitter.com/'+data.twitter_username;
    } else if (twitter.tagName == 'A') {
        twitter.innerHTML = data.twitter_username;
        twitter.href = 'http://twitter.com/'+data.twitter_username;
    }

    const company = document.querySelector('.company p');
    renderPara(company, data.company);
}