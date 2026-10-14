const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-rail');
const navLinks = [...document.querySelectorAll('.rail-nav a')];
const progressBar = document.querySelector('.progress-line span');
const sections = [...document.querySelectorAll('main > section[id]')];
const revealItems = document.querySelectorAll('.reveal');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
const lightboxClose = lightbox.querySelector('.lightbox-close');

function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const willOpen = !navigation.classList.contains('open');
  navigation.classList.toggle('open', willOpen);
  menuButton.setAttribute('aria-expanded', String(willOpen));
  document.body.classList.toggle('menu-open', willOpen);
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

revealItems.forEach(item => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

document.querySelectorAll('.record').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.image;
    lightboxImage.style.transform = item.dataset.rotate === '180' ? 'rotate(180deg)' : '';

    lightboxImage.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();

const derrickTermButtons=[...document.querySelectorAll('[data-select-term]')];
function selectDerrickTerm(term,write=true){
 if(!['prelims','midterms'].includes(term))term='midterms';
 document.querySelectorAll('[data-term]').forEach(p=>p.hidden=p.dataset.term!==term);
 document.querySelectorAll('[data-reflection-term]').forEach(p=>p.hidden=p.dataset.reflectionTerm!==term);
 derrickTermButtons.forEach(b=>{const active=b.dataset.selectTerm===term;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
 document.querySelector('.derrick-term-status').textContent=`Viewing ${term==='midterms'?'Midterms':'Prelims'} · 2026`;
 navLinks.forEach(a=>{const base=a.getAttribute('href').replace('-midterms','');if(['#journey','#reflection'].includes(base))a.setAttribute('href',term==='midterms'?base+'-midterms':base)});
 document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));updateProgress();
 if(write){const url=new URL(location.href);url.searchParams.set('term',term);history.replaceState(null,'',url)}
}
derrickTermButtons.forEach((b,i)=>{b.addEventListener('click',()=>selectDerrickTerm(b.dataset.selectTerm));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?1:1-i;selectDerrickTerm(derrickTermButtons[n].dataset.selectTerm);derrickTermButtons[n].focus()})});
selectDerrickTerm(new URLSearchParams(location.search).get('term'),false);
window.addEventListener('popstate',()=>selectDerrickTerm(new URLSearchParams(location.search).get('term'),false));
document.querySelectorAll('.derrick-entry').forEach(card=>card.addEventListener('toggle',()=>{if(card.open)document.querySelectorAll('.derrick-entry[open]').forEach(other=>{if(other!==card)other.open=false})}));
