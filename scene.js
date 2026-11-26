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

// A native audio element keeps the song playing while visitors scroll.
const musicButton = document.querySelector('.music-invite');
const musicLabel = document.querySelector('.music-label');
const musicStatus = document.querySelector('.music-status');
const music = document.getElementById('afternoon-music');
music.volume = .35;
let startingMusic = false;
function showMusicState(playing) {
 musicButton.setAttribute('aria-pressed', String(playing));
 musicLabel.textContent = playing ? 'Pause music' : 'Enjoy a song I love with me.';
}
function musicFailed() {
 musicStatus.textContent = 'The song could not play. Please try again.';
 musicStatus.hidden = false;
 showMusicState(false);
}
musicButton.addEventListener('click', async () => {
 if (startingMusic) return;
 musicStatus.hidden = true;
 if (!music.paused) { music.pause(); return; }
 startingMusic = true;
 try {
  if (music.ended) music.currentTime = 0;
  await music.play();
 } catch { musicFailed(); }
 finally { startingMusic = false; }
});
music.addEventListener('playing', () => showMusicState(true));
music.addEventListener('pause', () => showMusicState(false));
music.addEventListener('ended', () => showMusicState(false));
music.addEventListener('error', musicFailed);
