// ----- Sample data -----
const data = [
  { id: "m1", title: "Shadow City", img: "https://i.ebayimg.com/images/g/l88AAOSwsFVax5qg/s-l1200.jpg", desc: "Action-packed urban adventure.", type: "movie" },
  { id: "m2", title: "Neon Dreams", img: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/epic-fantasy-movie-poster-design-template-fc2d5f7708a1a49889ac1b54a1eb2143_screen.jpg?ts=1692349525", desc: "A neon-soaked cyberpunk tale.", type: "movie" },
  { id: "m3", title: "Crimson Tide", img: "https://images.cdn-files-a.com/uploads/2058276/2000_5ca271aada963.jpg", desc: "High-stakes submarine drama.", type: "movie" },
  { id: "s1", title: "Infinity Run", img: "https://i.pinimg.com/736x/9d/0f/70/9d0f7042c01b22b1fe03b9b7d8639235.jpg", desc: "Sci-fi racing adventure.", type: "series" },
  { id: "s2", title: "Nova Rising", img: "https://creativereview.imgix.net/uploads/2024/12/AlienRomulus-scaled.jpg?auto=compress,format&crop=faces,entropy,edges&fit=crop&q=60&w=1728&h=2560", desc: "Epic alien war saga.", type: "series" }
];

// ----- My List storage -----
const STORAGE_KEY = "sanjustream_mylist";
function getMyList() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function saveMyList(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
function isInMyList(id) { return getMyList().some(item => item.id === id); }
function addToMyList(item) { const list = getMyList(); if(!list.some(i=>i.id===item.id)) { list.push(item); saveMyList(list); } }
function removeFromMyList(id) { const list = getMyList().filter(i=>i.id!==id); saveMyList(list); }

// ----- Poster creation -----
function createPoster(item) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('poster-wrapper');

  const div = document.createElement('div');
  div.classList.add('poster');
  div.style.backgroundImage = `url(${item.img})`;
  div.title = item.title;
  div.setAttribute('data-id', item.id);
  div.setAttribute('data-title', item.title);

  div.addEventListener('click', () => openPopup(item));
  wrapper.appendChild(div);
  return wrapper;
}

function loadSliderForPage(page) {
  const slider = document.getElementById('slider');
  if(!slider) return;
  slider.innerHTML = "";

  let items = [];
  if(page==="home") items = data.slice(0,8);
  else if(page==="movies") items = data.filter(d=>d.type==="movie");
  else if(page==="series") items = data.filter(d=>d.type==="series");
  else if(page==="mylist") items = getMyList();

  if(!items.length) { slider.innerHTML="<p style='color:#aaa'>No items to show.</p>"; return; }
  items.forEach(item=>slider.appendChild(createPoster(item)));
}

// ----- Popup -----
const popup = document.getElementById('popup');
const popupImg = document.getElementById('popupImg');
const popupTitle = document.getElementById('popupTitle');
const popupDesc = document.getElementById('popupDesc');
const toggleListBtn = document.getElementById('toggleListBtn');
const closePopupBtn = document.getElementById('closePopup');

function openPopup(item){
  if(!popup) return;
  popupImg.src = item.img;
  popupImg.alt = item.title + " poster";
  popupTitle.innerText = item.title;
  popupDesc.innerText = item.desc;

  if(toggleListBtn){
    toggleListBtn.dataset.itemId=item.id;
    toggleListBtn.dataset.itemTitle=item.title;
    toggleListBtn.dataset.itemImg=item.img;
    toggleListBtn.dataset.itemDesc=item.desc;
    toggleListBtn.innerText = isInMyList(item.id) ? "Remove from My List" : "Add to My List";
  }

  popup.classList.remove('hidden');
}

function closePopup() { popup.classList.add('hidden'); }
if(closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
if(popup) popup.addEventListener('click', e=>{if(e.target===popup) closePopup();});
document.addEventListener('keydown', e=>{if(e.key==="Escape") closePopup();});

if(toggleListBtn) toggleListBtn.addEventListener('click', ()=>{
  const id = toggleListBtn.dataset.itemId;
  const title = toggleListBtn.dataset.itemTitle;
  const img = toggleListBtn.dataset.itemImg;
  const desc = toggleListBtn.dataset.itemDesc;
  if(isInMyList(id)) { removeFromMyList(id); toggleListBtn.innerText="Add to My List"; }
  else { addToMyList({id,title,img,desc}); toggleListBtn.innerText="Remove from My List"; }
  if(document.body.dataset.page==="mylist") loadSliderForPage("mylist");
});

// ----- Mobile menu -----
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
if(menuBtn && mobileNav){
  menuBtn.addEventListener('click', e=>{e.stopPropagation(); mobileNav.classList.toggle('show');});
  document.addEventListener('click', e=>{if(mobileNav.classList.contains('show')&&!mobileNav.contains(e.target)&&e.target!==menuBtn) mobileNav.classList.remove('show');});
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> mobileNav.classList.remove('show')));
}

// ----- Init -----
document.addEventListener('DOMContentLoaded', ()=>{ loadSliderForPage(document.body.dataset.page||"home"); });
