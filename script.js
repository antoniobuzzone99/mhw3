/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

let esito = [];
const images = document.querySelectorAll('.risposta');
for(const image of images){
  image.addEventListener('click', seleziona);
}

function seleziona(event){
  const element = event.currentTarget;
  const check= element.querySelector('.checkbox'); 
  check.src = './images/checked.png';
  element.classList.add('sfondo');

  for(let i of images){
    if(i.dataset.questionId === event.currentTarget.dataset.questionId && i !== event.currentTarget){
      let opacita= i.querySelector('.opacita');
      opacita.classList.remove('hidden');
      let img = i.querySelector('.checkbox');
      img.src = './images/unchecked.png';
      if(i.classList.contains('sfondo')){
        i.classList.remove('sfondo'); 
      }
    }
  }

  const opacita = element.querySelector('.opacita');
  if(!opacita.classList.contains('hidden')){
    opacita.classList.add('hidden');
  }
  
  assegnaEsito(event.currentTarget.dataset.choiceId, event.currentTarget.dataset.questionId);
  calcoloesitoF();

  if(Object.keys(esito).length === 3){
    for(let img of images){
      img.removeEventListener('click', seleziona);
    }
  }
}

function assegnaEsito(cId, qId){
  if(qId === 'one'){
    esito[0] = cId;
  }
  else if(qId === 'two'){
    esito[1] = cId;
  }
  else{
    esito[2] = cId;
  }
}

function calcoloesitoF(){
  if(Object.keys(esito).length === 3){
    if(esito[1] === esito[2] && esito[1] !== esito[0]){
      const tit = document.getElementById('titolo');
      const com = document.getElementById('commento');
      tit.textContent = RESULTS_MAP[esito[1]].title;
      com.textContent = RESULTS_MAP[esito[1]].contents;
    }
    else{
      const tit = document.getElementById('titolo');
      const com = document.getElementById('commento');
      tit.textContent = RESULTS_MAP[esito[0]].title;
      com.textContent = RESULTS_MAP[esito[0]].contents;
    }
    const tasto = document.getElementById('reset');
    tasto.addEventListener('click',ricomincia_quiz);
    const fine = document.getElementById('fine');
    fine.classList.remove('hidden');
  }
}

function ricomincia_quiz(event){
  esito = [];
  for(let i of images){
    const opacita= i.querySelector('.opacita');
    opacita.classList.add('hidden');
    const unc= i.querySelector('.checkbox');
    unc.src = './images/unchecked.png';
    i.classList.remove('sfondo');
    const fine = document.getElementById('fine');
    fine.classList.add('hidden');
    fine.removeEventListener('click', ricomincia_quiz);
    i.addEventListener('click',seleziona);
  }
}


function onJson1(json){
  console.log(json);
  const ris= document.querySelector('#risposta');
  ris.innerHTML = '';

  const box = document.createElement('div');
  box.classList.add('box');
  
  const imm = document.createElement('img');
  imm.src=json.data.logos.dark;

  const nome = document.createElement('span');
  nome.textContent = json.data.name;

  box.appendChild(imm);
  box.appendChild(nome);

  ris.appendChild(box);
}

function onResponse1(response){
  console.log("risposta 1 ricevuta");
  return response.json();
}

function ricerca1(event){
  event.preventDefault();
  const valore_input = document.querySelector('#valore');
  const valore_c = encodeURIComponent(valore_input.value);
  rest_url = 'https://api-football-standings.azharimm.site/leagues/' + valore_c;
  fetch(rest_url).then(onResponse1).then(onJson1);
}

const f = document.querySelector('#form1');
f.addEventListener('submit', ricerca1);


function onResponse2(response){
  console.log("risposta 2 ricevuta");
  return response.json();
}

function onTokenResponse(response){
  return response.json();
}

function onTokenJson(json){
  console.log(json);
  token= json.access_token;
}

const api_key='';

const email = 'a.buzzone2011.ab@gmail.com';
const password = encodeURIComponent('esempioapi');
let token;

fetch('https://kitsu.io/api/oauth/token',{
    method:'POST',
    body:'grant_type=password&username='+email+'&password='+password,
    headers:{ 
        'Content-Type':'application/x-www-form-urlencoded'
    }
}).then(onTokenResponse).then(getToken);

function getToken(json){
  token = json;
  console.log(json);
}

function ricerca2(event){
  event.preventDefault();
  const valore_input = document.querySelector('#valore2');
  const valore_c = encodeURIComponent(valore_input.value);
  
  fetch('https://kitsu.io/api/edge/anime?filter[text]'+ valore_c,{
    headers: {
        'Accept':'application/vnd.api+json',
        'Authorization':token.token_type + '' + token.access_token,
        'Content-Type':'application/x-wwwform-urlencoded'
    }
}).then(onResponse2).then(onJson2);

}

function onJson2(json) {
  console.log('json ricevuto');
  console.log(json);
  const res = document.querySelector('#risposta2');
  res.innerHTML = '';
  const risultato = json.data;
  
  let numeroris = risultato.length;

  for(let i=0; i<numeroris; i++){

    const box = document.createElement('div');
    box.classList.add('box');

    const img = document.createElement('img');
    img.src = risultato[i].attributes.coverImage.tiny;

    const testo = document.createElement('span');
    testo.textContent = risultato[i].attributes.canonicalTitle;

    const testo1 = document.createElement('span');
    testo1.classList.add('data');
    testo1.textContent = risultato[i].attributes.endDate;

    const testo2 = document.createElement('span');
    testo2.classList.add('descrizione');
    testo2.textContent = risultato[i].attributes.description;

    box.appendChild(img);
    box.appendChild(testo);
    box.appendChild(testo1);
    box.appendChild(testo2);

    res.appendChild(box);
  }
}

const f2 = document.querySelector('#form2');
f2.addEventListener('submit', ricerca2);