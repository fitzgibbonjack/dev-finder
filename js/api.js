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
    return fetch(`https://api.github.com/users/`+username)
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
searchField.addEventListener('keydown', function(event) {
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

    // render links section
    const location = document.querySelector('.location p');
    if (data.location == null || data.location == '') {
        location.innerHTML = 'Not Available';
        location.parentNode.classList.add('unavailable');
    } else if (location.parentElement.classList.contains('unavailable')) {
        location.parentNode.classList.remove('unavailable');
        location.innerHTML = data.location;
    } else {
        location.innerHTML = data.location;
    }

    const website = document.querySelector('.website span').firstChild;
    if (data.blog == null || data.blog == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        document.querySelector('.website').classList.add('unavailable');
        website.parentNode.replaceChild(para, website);
    } else {
        if (website.tagName == 'P') {
            const anchor = document.createElement('a');
            anchor.appendChild(document.createTextNode(data.blog));
            website.parentNode.replaceChild(anchor, website);
            document.querySelector('.website').classList.remove('unavailable');
            document.querySelector('.website span a').href = data.blog;
        } else if (website.tagName == 'A') {
            website.innerHTML = data.blog;
            website.href = data.blog;
        }
    }

    const twitter = document.querySelector('.twitter span').firstChild;
    if (data.twitter_username == null || data.twitter_username == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        document.querySelector('.twitter').classList.add('unavailable');
        twitter.parentNode.replaceChild(para, twitter);
    } else {
        if (twitter.tagName == 'P') {
            const anchor = document.createElement('a');
            anchor.appendChild(document.createTextNode(data.twitter_username));
            twitter.parentNode.replaceChild(anchor, twitter);
            document.querySelector('.twitter').classList.remove('unavailable');
            document.querySelector('.twitter span a').href = 'http://twitter.com/'+data.twitter_username;
        } else if (twitter.tagName == 'A') {
            twitter.innerHTML = data.twitter_username;
            twitter.href = 'http://twitter.com/'+data.twitter_username;
        }
    }

    const company = document.querySelector('.company p');
    if (data.company == null || data.company == '') {
        const para = document.createElement('p');
        para.appendChild(document.createTextNode('Not Available'));
        company.parentNode.classList.add('unavailable');
        company.parentNode.replaceChild(para, company);
    } else if (company.parentElement.classList.contains('unavailable')) {
        company.parentNode.classList.remove('unavailable');
        company.innerHTML = data.company;
    } else {
        location.innerHTML = data.company;
    }
}