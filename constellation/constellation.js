'use strict';
const starLayer = document.getElementById('stars');
const lines = document.getElementById('lines');
const caption = document.getElementById('caption');
const nameInput = document.getElementById('name');
const undoButton = document.getElementById('undo');
const clearButton = document.getElementById('clear');
const downloadButton = document.getElementById('download');
let stars = [], path = [];
const ns = 'http://www.w3.org/2000/svg';
function makeSky() {
  path = [];
  stars = [];
  starLayer.replaceChildren();
  for (let i = 0; i < 60; i++) {
    const dust = document.createElement('span');
    dust.className = 'dust';
    dust.style.left = `${Math.random() * 100}%`;
    dust.style.top = `${Math.random() * 94}%`;
    starLayer.append(dust);
  }
  for (let i = 0; i < 16; i++) {
    // One star per grid cell keeps touch targets separated even on small screens.
    const x = 10 + (i % 4) * 26 + Math.random() * 4;
    const y = 10 + Math.floor(i / 4) * 22 + Math.random() * 4;
    stars.push({x, y});
    const button = document.createElement('button');
    button.className = 'star';
    button.style.left = `${x}%`;
    button.style.top = `${y}%`;
    button.setAttribute('aria-label', `Star ${i + 1}`);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      if (path[path.length - 1] === i) return;
      path.push(i);
      render();
    });
    starLayer.append(button);
  }
  render();
}
function render() {
  lines.replaceChildren();
  if (path.length > 1) {
    const polyline = document.createElementNS(ns, 'polyline');
    polyline.setAttribute('points', path.map(i => `${stars[i].x * 10},${stars[i].y * 5.6}`).join(' '));
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', '#e9bdd0');
    polyline.setAttribute('stroke-width', '2');
    polyline.setAttribute('vector-effect', 'non-scaling-stroke');
    lines.append(polyline);
  }
  starLayer.querySelectorAll('.star').forEach((button, i) => {
    const selected = path.includes(i);
    button.classList.toggle('selected', selected);
    button.classList.toggle('last', path[path.length - 1] === i);
    button.setAttribute('aria-pressed', String(selected));
  });
  undoButton.disabled = clearButton.disabled = path.length === 0;
  downloadButton.disabled = path.length < 2;
  const title = nameInput.value.trim();
  caption.textContent = title || (path.length === 0 ? 'Your sky is waiting.' : path.length === 1 ? 'A beginning. Pick another star.' : `${path.length - 1} connections. A little universe of your own.`);
}
undoButton.addEventListener('click', () => { path.pop(); render(); });
clearButton.addEventListener('click', () => { path = []; render(); });
document.getElementById('shuffle').addEventListener('click', makeSky);
nameInput.addEventListener('input', render);
downloadButton.addEventListener('click', () => {
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('xmlns', ns);
  svg.setAttribute('viewBox', '0 0 1000 660');
  svg.setAttribute('width', '1000'); svg.setAttribute('height', '660');
  const background = document.createElementNS(ns, 'rect');
  background.setAttribute('width', '1000'); background.setAttribute('height', '660');
  background.setAttribute('fill', '#26223c'); svg.append(background);
  [...lines.children].forEach(line => svg.append(line.cloneNode(true)));
  stars.forEach((star, i) => {
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', star.x * 10); circle.setAttribute('cy', star.y * 5.6);
    circle.setAttribute('r', path.includes(i) ? '5' : '3');
    circle.setAttribute('fill', path.includes(i) ? '#f4b6cf' : '#fff0b7'); svg.append(circle);
  });
  function text(y, value, size, fill) {
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', '500'); label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle'); label.setAttribute('fill', fill);
    label.setAttribute('font-family', 'Georgia,serif'); label.setAttribute('font-size', size);
    label.textContent = value; svg.append(label);
  }
  text(585, nameInput.value.trim() || 'My little constellation', '28', '#f4b6cf');
  text(625, 'Made in Yuhan’s Mini (messy) Universe', '15', '#bdb5ce');
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], {type: 'image/svg+xml'}));
  const link = document.createElement('a'); link.href = url; link.download = 'my-little-constellation.svg';
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
makeSky();
