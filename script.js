// Loading Screen
document.body.classList.add('loading');
const loader = document.getElementById('loader');
const countdownEl = document.getElementById('countdown');
const rocketWrapper = document.querySelector('.rocket-wrapper');
const flame = document.querySelector('.flame');
const skipBtn = document.getElementById('skipLoader');

function hideLoader() {
  loader.classList.add('hidden');
  document.body.classList.remove('loading');
  setTimeout(() => { loader.style.display = 'none'; }, 500);
  setTimeout(startBgVideo, 600);
}

function startBgVideo() {
  var video = document.getElementById('bgVideo');
  var wrapper = document.querySelector('.bg-video-wrapper');
  if (video && wrapper && window.getComputedStyle(wrapper).display !== 'none') {
    video.play().catch(function(){});
  }
}

if (localStorage.getItem('visited')) {
  hideLoader();
  document.body.classList.remove('loading');
} else {
  localStorage.setItem('visited', 'true');
}

skipBtn.addEventListener('click', hideLoader);

function spawnSmoke(count) {
  const wrapper = rocketWrapper;
  for (let i = 0; i < count; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    const size = 8 + Math.random() * 28;
    smoke.style.width = size + 'px';
    smoke.style.height = size + 'px';
    smoke.style.left = (20 + Math.random() * 60) + '%';
    smoke.style.top = (90 + Math.random() * 30) + '%';
    smoke.style.animation = 'smoke-float ' + (1.0 + Math.random() * 1.0) + 's ease-out forwards';
    smoke.style.animationDelay = (Math.random() * 0.6) + 's';
    wrapper.appendChild(smoke);
    setTimeout(() => smoke.remove(), 2200);
  }
}

// Ready phase — smoke appears, no shake
spawnSmoke(10);
const readyInterval = setInterval(() => spawnSmoke(6), 750);

// Set phase
setTimeout(() => {
  countdownEl.style.animation = 'none';
  countdownEl.offsetHeight;
  countdownEl.textContent = 'Set';
  countdownEl.style.animation = 'fadeInUp 0.3s ease';
  clearInterval(readyInterval);
  rocketWrapper.classList.add('set');
  flame.style.height = '80px';
  flame.style.width = '38px';
  spawnSmoke(12);
  const setInterval = setInterval(() => spawnSmoke(8), 600);
  setTimeout(() => clearInterval(setInterval), 2100);
}, 1800);

// Go! phase
setTimeout(() => {
  clearInterval(readyInterval);
  countdownEl.style.animation = 'none';
  countdownEl.offsetHeight;
  countdownEl.textContent = 'Go!';
  countdownEl.style.animation = 'fadeInUp 0.3s ease';
  rocketWrapper.classList.remove('set');
  rocketWrapper.classList.add('go');
  flame.style.height = '100px';
  flame.style.width = '48px';
  spawnSmoke(16);
  const goInterval = setInterval(() => spawnSmoke(12), 450);
  setTimeout(() => {
    clearInterval(goInterval);
    rocketWrapper.classList.remove('go');
    flame.style.height = '';
    flame.style.width = '';
    rocketWrapper.classList.add('launch');
    setTimeout(hideLoader, 600);
  }, 1800);
}, 3600);

// Cursor
const rocket = document.getElementById('cursorRocket');
let mx = 0, my = 0;
let rx = 0, ry = 0;
let angle = 0;
let trail = [];

for (let i = 0; i < 10; i++) {
  let dot = document.createElement('div');
  dot.className = 'cursor-trail';
  let s = 18 - i * 1.5;
  let colors = ['#ff2200','#ff4400','#ff6600','#ff8800','#ffaa00','#ffcc00','#ffdd44','#ffee66','#fff4aa','#fff'];
  dot.style.cssText = 'width:'+s+'px;height:'+s+'px;background:'+colors[i]+';opacity:'+(0.9-i*0.08)+';box-shadow:0 0 '+(s+8)+'px '+colors[i];
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

document.addEventListener('mousemove', function (e) {
  mx = e.clientX;
  my = e.clientY;
});

function anim() {
  let prx = rx, pry = ry;
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;

  let vx = rx - prx, vy = ry - pry;
  if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
    let t = Math.atan2(vy, vx) * (180 / Math.PI) + 90;
    let d = t - angle;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    angle += d * 0.2;
  }

  rocket.style.left = rx + 'px';
  rocket.style.top = ry + 'px';
  rocket.style.transform = 'translate(-50%, -50%) rotate(' + angle + 'deg)';

  let tx = rx, ty = ry;
  trail.forEach(t => {
    t.x += (tx - t.x) * 0.2;
    t.y += (ty - t.y) * 0.2;
    t.el.style.left = t.x + 'px';
    t.el.style.top = t.y + 'px';
    tx = t.x; ty = t.y;
  });

  requestAnimationFrame(anim);
}
anim();

document.querySelectorAll('a, button, .cert-card img, .project-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => rocket.classList.add('hover'));
  el.addEventListener('mouseleave', () => rocket.classList.remove('hover'));
});

function animateSkills() {
  const fills = document.querySelectorAll('.skill-bar .fill');
  fills.forEach(el => {
    const w = el.getAttribute('data-width');
    el.style.transform = 'scaleX(' + (w / 100) + ')';
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkills();
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.section h2 .fa-code');
if (skillsSection) {
  observer.observe(skillsSection.closest('.section'));
} else {
  window.addEventListener('load', animateSkills);
}

// Filter buttons
function applyFilter(btn) {
  document.querySelectorAll('.filter-btns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.getAttribute('data-filter');
  const items = document.querySelectorAll('.skill-item');
  let delay = 0;
  items.forEach(item => {
    item.classList.remove('fade-in');
    if (item.getAttribute('data-category') === filter) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(18px)';
      item.classList.remove('hidden');
      const animDelay = delay;
      requestAnimationFrame(() => {
        setTimeout(() => {
          item.style.opacity = '';
          item.style.transform = '';
          item.classList.add('fade-in');
        }, animDelay);
      });
      delay += 100;
    } else {
      item.classList.add('hidden');
    }
  });
}

document.querySelectorAll('.filter-btns button').forEach(btn => {
  btn.addEventListener('click', function () {
    applyFilter(this);
  });
});

applyFilter(document.querySelector('.filter-btns button.active'));

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// GitHub repos
const GITHUB_USER = 'Lawliet-s';
const PER_PAGE = 6;
let allRepos = [];
let displayedCount = 0;
let repoFilter = '';

function renderRepos() {
  const grid = document.getElementById('projectGrid');
  const filtered = allRepos.filter(r => r.name.toLowerCase().includes(repoFilter));
  const toShow = filtered.slice(0, displayedCount);

  grid.innerHTML = toShow.map((repo, i) => {
    const desc = repo.description || 'No description';
    const lang = repo.language || '-';
    const demoLink = repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer"><i aria-hidden="true" class="fas fa-external-link-alt"></i> Demo</a>` : '';
    return `
      <div class="project-card reveal" style="transition-delay:${(i % PER_PAGE) * 0.1}s">
        <h4>${repo.name}</h4>
        <p>${desc}</p>
        <span class="lang">${lang}</span>
        <div class="links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><i aria-hidden="true" class="fab fa-github"></i> Repo</a>
          ${demoLink}
        </div>
      </div>
    `;
  }).join('');

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="github-error">No projects found.</p>';
  }

  document.getElementById('viewMoreBtn').style.display =
    displayedCount >= filtered.length ? 'none' : 'inline-block';

  // observe new reveal elements
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function loadRepos() {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = '<p class="github-error">Loading repos...</p>';

  fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=100')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(repos => {
      allRepos = repos.filter(r => !r.fork && !r.archived);
      displayedCount = Math.min(PER_PAGE, allRepos.length);
      document.getElementById('projectCount').innerHTML = allRepos.length + '<span>+</span>';
      renderRepos();
    })
    .catch(() => {
      grid.innerHTML = '<p class="github-error">Failed to load repos. Try again later.</p>';
    });
}

document.getElementById('githubSearch').addEventListener('input', function () {
  repoFilter = this.value.toLowerCase();
  displayedCount = Math.min(PER_PAGE, allRepos.length);
  renderRepos();
});

document.getElementById('viewMoreBtn').addEventListener('click', function () {
  displayedCount += PER_PAGE;
  renderRepos();
});

loadRepos();

// Navbar
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const expanded = hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', expanded);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

const backToTopFloat = document.getElementById('backToTopFloat');

const sectionOffsets = [];
function cacheSectionOffsets() {
  sectionOffsets.length = 0;
  document.querySelectorAll('.section, #home').forEach(section => {
    sectionOffsets.push({ id: section.id, top: section.offsetTop - 120 });
  });
}
cacheSectionOffsets();

let ticking = false;
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  backToTopFloat.classList.toggle('visible', window.scrollY > 300);

  if (!ticking) {
    requestAnimationFrame(() => {
      let current = 'home';
      for (const s of sectionOffsets) {
        if (window.scrollY >= s.top) current = s.id;
      }
      navLinks.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener('resize', cacheSectionOffsets);
// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.cert-card img').forEach(img => {
  img.addEventListener('click', function () {
    lightboxImg.src = this.src;
    lightbox.classList.add('open');
  });
});

document.getElementById('lightboxClose').addEventListener('click', function () {
  lightbox.classList.remove('open');
});

lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) {
    lightbox.classList.remove('open');
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// Contact form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = this.querySelector('.contact-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  try {
    const res = await fetch('https://formspree.io/f/mlgkvlwe', {
      method: 'POST',
      body: new FormData(this),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Message sent! Thank you 🚀';
      this.reset();
    } else {
      throw new Error('Failed to send');
    }
  } catch {
    formStatus.className = 'form-status error';
    formStatus.textContent = 'Failed to send. Please email me directly at Rifqiusaha@gmail.com';
  }
  btn.disabled = false;
  btn.textContent = 'Send Message 🚀';
});
