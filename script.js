/* ============================================================
   CONFIG — edit these values to personalize the site
   ============================================================ */
const CONFIG = {
  partnerName: "Kia",          // her name, e.g. "Maria"
  fromLabel: "from your someone", // small label above the headline, e.g. "from Alex"
  heroSubtitle: "a small corner of the internet, built just to remind you how loved you are.",
  sinceDate: "2026-07-02",     // the date you got together, format YYYY-MM-DD
  letter: "I wanted a place on the internet that belonged only to us — no algorithm deciding what you see, no ads, just this. Every word here I mean completely. Thank you for being the softest, easiest thing to love in my whole life. I'd choose all of it again, every time, no matter how many times I got to choose.",
  letterSign: "— always yours"
};

document.getElementById('partnerNameHero').textContent = CONFIG.partnerName;
document.getElementById('fromLabel').textContent = CONFIG.fromLabel;
document.getElementById('heroSub').textContent = CONFIG.heroSubtitle;
document.getElementById('letterBody').textContent = CONFIG.letter;
document.getElementById('letterSign').textContent = CONFIG.letterSign;
document.title = "For " + CONFIG.partnerName;

/* ---------- scroll progress bar ---------- */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress);

/* ---------- reveal reasons on scroll ---------- */
const reasons = document.querySelectorAll('.reason');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold:0.2 });
reasons.forEach(r=>io.observe(r));

/* ---------- days counter ---------- */
function updateCounter(){
  const start = new Date(CONFIG.sinceDate);
  const now = new Date();
  const days = Math.max(0, Math.floor((now - start) / (1000*60*60*24)));
  document.getElementById('dayCounter').textContent = days.toLocaleString();
}
updateCounter();

/* ---------- ambient floating petals (canvas) ---------- */
const canvas = document.getElementById('petal-canvas');
const ctx = canvas.getContext('2d');
let petals = [];
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas(){
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function makePetal(){
  return {
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height - canvas.height,
    r: 3 + Math.random()*5,
    speed: 0.3 + Math.random()*0.6,
    drift: Math.random()*1.4 - 0.7,
    sway: Math.random()*Math.PI*2,
    opacity: 0.25 + Math.random()*0.4,
    hue: Math.random() > 0.5 ? '157,78,221' : '255,182,217'
  };
}

if(!reduceMotion){
  for(let i=0;i<45;i++) petals.push(makePetal());

  function animatePetals(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    petals.forEach(p=>{
      p.y += p.speed;
      p.sway += 0.02;
      p.x += Math.sin(p.sway)*0.6 + p.drift*0.05;
      if(p.y > canvas.height + 10){
        p.y = -10;
        p.x = Math.random()*canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();
}

/* ---------- gallery: built-in photos from /images ---------- */
const galleryGrid = document.getElementById('galleryGrid');

function renderGallery(){
  const cards = Array.from(galleryGrid.querySelectorAll('.polaroid'));

  cards.forEach((card, idx)=>{
    const src = card.getAttribute('data-src');
    card.style.setProperty('--tilt', ((idx % 5) - 2) + 'deg');

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'a memory of us';
    img.loading = 'lazy';
    card.appendChild(img);

    card.addEventListener('click', ()=>openLightbox(src));
  });
}

renderGallery();

/* ---------- lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.add('active');
}
function closeLightbox(){
  lightbox.classList.remove('active');
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

/* ---------- heart burst on click ---------- */
const heartBtn = document.getElementById('heartBtn');
heartBtn.addEventListener('click', ()=>{
  for(let i=0;i<10;i++){
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = ['💜','💗','✨'][Math.floor(Math.random()*3)];
    heart.style.left = (heartBtn.getBoundingClientRect().left + Math.random()*40) + 'px';
    heart.style.setProperty('--drift', (Math.random()*160 - 80) + 'px');
    heart.style.animationDelay = (Math.random()*0.3) + 's';
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(), 3000);
  }
});