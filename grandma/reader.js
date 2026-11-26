const chapters = [
  {
    "id": 0,
    "title": "序章 - 照片那边有人吗？",
    "english": "Prologue — Anyone on the Other Side?",
    "src": "page-00.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 1,
    "title": "第一话 - 强行加入合照",
    "english": "Photobombing the Family Portrait",
    "src": "page-01.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 2,
    "title": "第二话 - 那些年，外婆在工厂做牛马",
    "english": "Grandma’s Factory Grind",
    "src": "page-02.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 3,
    "title": "第三话 - 收腹！摄影师上线了",
    "english": "Breathe In! Your Photographer Has Arrived",
    "src": "page-03.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 4,
    "title": "第四话 - 这是什么雷霆造型？",
    "english": "What Is This Wild Pose?",
    "src": "page-04.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 5,
    "title": "第五话 - 祖孙婚纱大作战",
    "english": "Two Generations, Two Wedding Dresses",
    "src": "page-05.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 6,
    "title": "第六话 - 你说的弄一个是这个？！",
    "english": "You Said You’d Do My Hair—Not THIS!",
    "src": "page-06.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 7,
    "title": "第七话 - 跟着外婆吃成都",
    "english": "Eating Our Way Through Chengdu",
    "src": "page-07.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 8,
    "title": "第八话 - 外婆的嘴，精准打击",
    "english": "Grandma Never Misses",
    "src": "page-08.jpg",
    "width": 1105,
    "height": 1424
  },
  {
    "id": 9,
    "title": "第九话 - 长大了也得排队",
    "english": "Even Grown-up Me Has to Wait",
    "src": "page-09.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 10,
    "title": "第十话 - 笑容正在装修中",
    "english": "A Smile Under Construction",
    "src": "page-10.jpg",
    "width": 1086,
    "height": 1448
  },
  {
    "id": 11,
    "title": "第十一话 - 两位，靠近一点啊！",
    "english": "You Two—A Little Closer!",
    "src": "page-11.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 12,
    "title": "第十二话 - 借外公一只胳膊",
    "english": "Borrowing Grandpa’s Arm",
    "src": "page-12.jpg",
    "width": 1199,
    "height": 1312
  },
  {
    "id": 13,
    "title": "第十三话 - 外婆的娘家人",
    "english": "Grandma’s Side of the Family",
    "src": "page-13.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 14,
    "title": "第十四话 - 谁才是主角？",
    "english": "Who’s the Star Here?",
    "src": "page-14.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 15,
    "title": "第十五话 - 原来海边在这里",
    "english": "So This Is the Beach!",
    "src": "page-15.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 16,
    "title": "第十六话 - 教教我这个姿势",
    "english": "Teach Me That Pose",
    "src": "page-16.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 17,
    "title": "第十七话 - 陪你走一段旧时光",
    "english": "A Walk Through Your World",
    "src": "page-17.jpg",
    "width": 1024,
    "height": 1536
  },
  {
    "id": 18,
    "title": "尾声 - 雨雨要快乐哦",
    "english": "Epilogue — Yuyu, Be Happy, Okay?",
    "src": "page-18.jpg",
    "width": 1024,
    "height": 1536
  }
];
(() => {
  'use strict';
  const image = document.getElementById('comic-page');
  const stage = document.getElementById('image-stage');
  const error = document.getElementById('image-error');
  const heading = document.getElementById('chapter-heading');
  const english = document.getElementById('chapter-english');
  const position = document.getElementById('page-position');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const select = document.getElementById('chapter-select');
  const fullSize = document.getElementById('full-size');
  const cards = [...document.querySelectorAll('[data-chapter]')];
  let current = 0;
  const fromUrl = () => {
    const raw = new URL(location.href).searchParams.get('chapter');
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n < chapters.length ? n : 0;
  };
  image.addEventListener('load', () => { stage.setAttribute('aria-busy', 'false'); error.hidden = true; });
  image.addEventListener('error', () => { stage.setAttribute('aria-busy', 'false'); error.hidden = false; });
  function show(index, updateUrl = false, scroll = false) {
    current = Math.max(0, Math.min(chapters.length - 1, index));
    const chapter = chapters[current];
    heading.textContent = chapter.title;
    english.textContent = chapter.english;
    position.textContent = `Page ${current + 1} of ${chapters.length} · 第 ${current + 1} / ${chapters.length} 页`;
    select.value = String(current);
    previous.disabled = current === 0;
    next.disabled = current === chapters.length - 1;
    image.width = chapter.width;
    image.height = chapter.height;
    image.alt = `${chapter.title} / ${chapter.english}. Bilingual photo manga.`;
    const changed = image.getAttribute('src') !== chapter.src;
    if (changed) { stage.setAttribute('aria-busy', 'true'); error.hidden = true; image.src = chapter.src; }
    fullSize.href = chapter.src;
    cards.forEach(card => {
      if (Number(card.dataset.chapter) === current) card.setAttribute('aria-current', 'page');
      else card.removeAttribute('aria-current');
    });
    if (updateUrl) { const url = new URL(location.href); url.searchParams.set('chapter', String(current)); url.hash = 'reader'; history.pushState({ chapter: current }, '', url); }
    document.title = `${chapter.title} · Reuniting with Grandma Across Time`;
    if (scroll) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      document.getElementById('reader').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }
  }
  previous.addEventListener('click', () => show(current - 1, true, true));
  next.addEventListener('click', () => show(current + 1, true, true));
  select.addEventListener('change', () => show(Number(select.value), true, true));
  cards.forEach(card => card.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); show(Number(card.dataset.chapter), true, true);
  }));
  document.getElementById('retry').addEventListener('click', () => {
    stage.setAttribute('aria-busy', 'true'); error.hidden = true;
    image.src = `${chapters[current].src}?retry=${Date.now()}`;
  });
  addEventListener('popstate', () => show(fromUrl(), false, true));
  addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    if (event.key === 'ArrowRight' && current < chapters.length - 1) { event.preventDefault(); show(current + 1, true, true); }
    if (event.key === 'ArrowLeft' && current > 0) { event.preventDefault(); show(current - 1, true, true); }
  });
  show(fromUrl(), false, false);
})();
