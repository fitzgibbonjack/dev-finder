const searchButton = document.querySelector('.search-area button');
const searchField = document.querySelector('.search-area input');
const errorMsg = document.querySelector('.search-area span');

// if http response code not in sucessful range, throws error
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
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
    fetchData(searchField.value);
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

    let joinDate = new Date(data.created_at).toDateString();
    document.querySelector('.header-text p').innerHTML = `Joined ${joinDate.split(' ').slice(1).join(' ')}`;

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

    // render location
    const location = document.querySelector('.location p');
    if (data.location == null || data.location == '') {
        location.innerHTML = 'Not Available';
        location.parentNode.classList.add('unavailable');
    } else {
        location.innerHTML = data.location;
    }

    // render links section
    const website = document.querySelector('.website a');
    if (data.blog == null || data.blog == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        website.parentNode.classList.add('unavailable');
        website.parentNode.replaceChild(para, website);
    } else {
        website.innerHTML = data.blog;
        website.setAttribute('href', data.blog);
    }

    const twitter = document.querySelector('.twitter a');
    if (data.twitter_username == null || data.twitter_username == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        twitter.parentNode.classList.add('unavailable');
        twitter.parentNode.replaceChild(para, twitter);
    } else {
        twitter.innerHTML = data.twitter_username;
        twitter.setAttribute('href', `http://twitter.com/${data.twitter_username}`);
    }

    const company = document.querySelector('.company a');
    if (data.company == null || data.company == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        company.parentNode.classList.add('unavailable');
        company.parentNode.replaceChild(para, company);
    } else {
        company.innerHTML = data.company;
        company.setAttribute('href', data.company);
    }
}




