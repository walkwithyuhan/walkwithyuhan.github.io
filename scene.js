'use strict';
const journey = document.querySelector('.afternoon-journey');
const scene = journey.querySelector('.scene');
const story = scene.querySelector('.story-card');
const toggle = scene.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;
function updateMotion() {
 scene.classList.toggle('motion-paused', paused);
 toggle.textContent = paused ? 'Play breeze' : 'Pause breeze';
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
 scene.querySelector('.wander-link').tabIndex = progress > .35 ? -1 : 0;
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
