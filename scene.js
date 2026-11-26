'use strict';
const journey = document.querySelector('.afternoon-journey');
const scene = journey.querySelector('.scene');
const story = scene.querySelector('.story-card');
const toggle = document.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
function updateMotion() {
 scene.classList.toggle('motion-paused', paused);
 toggle.setAttribute('aria-label', paused ? 'Enable animation' : 'Reduce animation');
 toggle.title = paused ? 'Enable animation' : 'Reduce animation';
 document.body.classList.toggle('motion-paused', paused);
 toggle.setAttribute('aria-pressed', String(paused));
 toggle.hidden = reducedMotion.matches;
}
toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
const clamp = value => Math.min(1, Math.max(0, value));
let framePending = false;
function renderScroll() {
 framePending = false;
 if (reducedMotion.matches) return;
 const range = Math.max(1, journey.offsetHeight - window.innerHeight);
 const progress = clamp(-journey.getBoundingClientRect().top / range);
 const rawZoom = clamp((progress - .10) / .68);
 const easedZoom = rawZoom * rawZoom * (3 - 2 * rawZoom);
 const mobile = window.innerWidth <= 700;
 const storyOpacity = clamp((progress - .47) / .19);
 scene.style.setProperty('--zoom', String(1 + easedZoom * (mobile ? 1.6 : 2.6)));
 scene.style.setProperty('--pan-x', `${easedZoom * (mobile ? 0 : -22)}vw`);
 scene.style.setProperty('--pan-y', `${easedZoom * (mobile ? 1 : -13)}vh`);
 scene.style.setProperty('--title-opacity', String(1 - clamp((progress - .08) / .23)));
 scene.style.setProperty('--story-opacity', String(storyOpacity));
 scene.style.setProperty('--story-art-opacity', String(clamp((progress - .16) / .26)));
 scene.style.setProperty('--story-shift', `${(1 - storyOpacity) * 22}px`);
 story.classList.toggle('is-visible', storyOpacity > .5);

}
function scheduleScroll() {
 if (!framePending) { framePending = true; requestAnimationFrame(renderScroll); }
}
window.addEventListener('scroll', scheduleScroll, {passive:true});
window.addEventListener('resize', scheduleScroll, {passive:true});
for (const link of document.querySelectorAll('a[href="#about"]')) {
 link.addEventListener('click', event => {
  if (reducedMotion.matches) return;
  event.preventDefault();
  const range = Math.max(1, journey.offsetHeight - window.innerHeight);
  window.scrollTo({top:journey.offsetTop + range * .88,behavior:'smooth'});
  history.replaceState(null,'','#about');
 });
}
reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); scheduleScroll(); });
new IntersectionObserver(([entry]) => scene.classList.toggle('scene-offscreen', !entry.isIntersecting), {threshold:0}).observe(scene);
document.addEventListener('visibilitychange', () => scene.classList.toggle('scene-offscreen', document.hidden));
updateMotion();
if (location.hash === '#about' && !reducedMotion.matches) {
 requestAnimationFrame(() => { window.scrollTo(0, journey.offsetTop + (journey.offsetHeight - window.innerHeight) * .88); scheduleScroll(); });
}
renderScroll();

// The visitor chooses whether to load and play the song; nothing autoplays.
const musicButton = document.querySelector('.music-invite');
const musicPanel = document.getElementById('music-panel');
const musicEmbed = document.querySelector('.music-embed');
function closeMusic() {
 musicPanel.hidden = true;
 musicButton.setAttribute('aria-expanded','false');
 musicEmbed.replaceChildren();
 musicButton.focus({preventScroll:true});
}
musicButton.addEventListener('click', () => {
 if (!musicPanel.hidden) { closeMusic(); return; }
 const player = document.createElement('iframe');
 player.src = 'https://open.spotify.com/embed/track/5vzDhLePmk0dQen49Xk4LB?utm_source=generator&theme=0';
 player.title = 'Into My Arms — Nick Cave & The Bad Seeds';
 player.width = '100%';
 player.height = '152';
 player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
 player.setAttribute('allowfullscreen','');
 player.style.border = '0';
 musicEmbed.replaceChildren(player);
 musicPanel.hidden = false;
 musicButton.setAttribute('aria-expanded','true');
});
document.querySelector('.music-close').addEventListener('click', closeMusic);
document.addEventListener('keydown', event => { if(event.key === 'Escape' && !musicPanel.hidden) closeMusic(); });
