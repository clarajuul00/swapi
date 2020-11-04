HTMLElement.prototype.clear = function(){
    while(this.firstChild){
        this.removeChild(this.firstChild);
    }
    return this;
};

const buildCharacterSheet = function(data){
    const article = document.createElement('article');
    article.setAttribute('class', 'characterSheet');

    const h1 = document.createElement('h1');
    const name = document.createTextNode(data.name);
    article.appendChild(h1);
    h1.appendChild(name);

    
    const entries = Object.entries(data);
    console.log(entries);

    for(i = 1; i < entries.length; i++){
        const p = document.createElement('p');
        const text = document.createTextNode(`${entries[i][0]}: ${entries[i][1]}`);

        article.appendChild(p);
        p.appendChild(text);
    }


    return article;
};


const buildFilmSheet = function(data){
    const article = document.createElement('article');
    article.setAttribute('class', 'filmSheet');

    const h1 = document.createElement('h1');
    const title = document.createTextNode(data.title);

    article.appendChild(h1);
    h1.appendChild(title);

    return article;
};

const buildCharacterList = function(data){

    const ul = document.createElement('ul');

    for(let i = 0; i < data.characters.length; i++){
        const li = document.createElement('li');
        const a = document.createElement('a');
        const text = document.createTextNode(data.characters[i]);
        ul.appendChild(li);
        li.appendChild(a);
        a.appendChild(text);

        const urlString = data.characters[i].replace('http://swapi.dev/api/', '');
    
        const type = urlString.split('/')[0];
        const id = urlString.split('/')[1];
        a.setAttribute('href', `?type=${type}&id=${id}`);

        // console.log(urlString);
    }

    return ul;
};

const buildNav = function(data){
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');
    nav.appendChild(ul);

    for(let i = 0; i < data.results.length; i++){
        const li = document.createElement('li');
        const a = document.createElement('a');
        const text = document.createTextNode(data.results[i].title);
        li.appendChild(a);
        a.appendChild(text);
        ul.appendChild(li);

        const urlString = data.results[i].url.replace('http://swapi.dev/api/', '');

        const type = 'films';
        const id = urlString.split('/')[1];
        a.setAttribute('href', `?type=${type}&id=${id}`);
    }

    return nav;
};

const getNav = function(type){
    fetch(`https://swapi.dev/api/${type}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('header').appendChild(buildNav(data));
        });
};

const getCharacterList = function(type, id){
    fetch(`https://swapi.dev/api/${type}/${id}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.filmSheet').appendChild(buildCharacterList(data));
        });
};

const getSingle = function(type, id){
    fetch(`https://swapi.dev/api/${type}/${id}/`)
        .then(response => response.json())
        .then(data => {
            let sheet;
            switch(type){
                case 'people':
                    sheet = buildCharacterSheet(data);
                    break;
                case 'films':
                    sheet = buildFilmSheet(data);
                    break;
                default:
                    sheet = buildFilmSheet(data);
            };
            document.querySelector('main').clear().appendChild(sheet);
        });
};



document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    

    let type = url.searchParams.get('type') || 'films';
    let id = url.searchParams.get('id') || 1;

    getNav('films', id);
    getSingle(type, id);
    getCharacterList(type, id);
});
