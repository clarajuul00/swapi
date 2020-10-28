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

    h1.appendChild(name);
    article.appendChild(h1);

    return article;
};


// const buildFilmSheet = function(data){
//     const article = document.createElement('article');
//     article.setAttribute('class', 'filmSheet');

//     const h1 = document.createElement('h1');
//     const name = document.createTextNode(data.title);

//     h1.appendChild(name);
//     article.appendChild(h1);

//     return article;
// };

const buildList = function(data){
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
    
        const type = urlString.split('/')[0];
        const id = urlString.split('/')[1];
        a.setAttribute('href', `?type=${type}&id=${id}`);
        console.log(urlString);
    }

    return nav;
};

const getList = function(type){
    fetch(`https://swapi.dev/api/${type}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('header').appendChild(buildList(data));
        });
};

const getSingle = function(type, id){
    fetch(`https://swapi.dev/api/${type}${id}/`)
        .then(response => response.json())
        .then(data => {
            let sheet;
            switch(type){
                case 'people':
                    sheet = buildCharacterSheet(data);
                    break;
                // case 'films':
                //     sheet = buildFilmSheet(data);
                //     break;
                default:
                    sheet = buildCharacterSheet(data);
            };
            document.querySelector('main').clear().appendChild(sheet);
        });
};



document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    

    let type = url.searchParams.get('type') || 'films';
    let page = url.searchParams.get('page') || 1;

    let id = url.searchParams.get('id') || 1;

    getList(type, id);
    getSingle(type, id);
});
