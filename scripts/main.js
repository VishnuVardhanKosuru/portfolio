/* =============================================
   VISHNU VARDHAN KOSURU — PORTFOLIO JS
   ============================================= */

// ---- Particle Canvas ----
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.8 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5 ? '57,255,20' : '0,230,118';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    const COUNT = Math.min(120, Math.floor((W * H) / 12000));
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(57,255,20,${0.07 * (1 - dist / maxDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(loop);
    }
    loop();
})();

// ---- Typing Effect ----
(function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const phrases = [
        'Associate Software Engineer',
        'Backend Developer',
        'Cloud & DevOps Learner',
        'AI/ML Explorer',
        'Python Enthusiast',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function type() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, 2000);
                return;
            }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }
        setTimeout(type, deleting ? 40 : 70);
    }
    setTimeout(type, 800);
})();

// ---- Navbar scroll effect ----
(function initNavbar() {
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    toggle?.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });
})();

// ---- Scroll Reveal ----
(function initScrollReveal() {
    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
})();

// ---- Skill Bar Animation ----
(function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                setTimeout(() => { bar.style.width = width + '%'; }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
})();

// ---- Counter Animation ----
(function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                let current = 0;
                const step = target / 40;
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = Math.round(current);
                    if (current >= target) clearInterval(timer);
                }, 30);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ---- Active nav link on scroll ----
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent-1)' : '';
        });
    }, { passive: true });
})();

// ---- Smooth hover glow on project cards ----
(function initProjectGlow() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mx', `${x}px`);
            card.style.setProperty('--my', `${y}px`);
        });
    });
})();

// ---- Dynamic GitHub Repo Count ----
(function fetchGitHubRepoCount() {
    const el = document.getElementById('github-repo-count');
    if (!el) return;
    fetch('https://api.github.com/users/VishnuVardhanKosuru')
        .then(r => r.json())
        .then(data => {
            const count = data.public_repos;
            if (typeof count === 'number') {
                // Animate count up
                let current = 0;
                const step = Math.ceil(count / 30);
                const timer = setInterval(() => {
                    current = Math.min(current + step, count);
                    el.textContent = current;
                    if (current >= count) clearInterval(timer);
                }, 40);
            }
        })
        .catch(() => {
            el.textContent = '—';
        });
})();

// ---- Like Counter ----
(function initLikeCounter() {
    const btn = document.getElementById('likeBtn');
    const countEl = document.getElementById('likeCount');
    if (!btn || !countEl) return;

    const STORAGE_KEY = 'vvk_portfolio_likes';
    let likes = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    countEl.textContent = likes;

    function spawnHearts(x, y) {
        const count = Math.floor(Math.random() * 3) + 3; // 3-5 hearts
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';
            const offsetX = (Math.random() - 0.5) * 60;
            const rot = (Math.random() - 0.5) * 40;
            heart.style.left = (x + offsetX) + 'px';
            heart.style.top = y + 'px';
            heart.style.setProperty('--rot', rot + 'deg');
            heart.style.animationDelay = (Math.random() * 0.15) + 's';
            document.body.appendChild(heart);
            heart.addEventListener('animationend', () => heart.remove());
        }
    }

    btn.addEventListener('click', (e) => {
        likes++;
        localStorage.setItem(STORAGE_KEY, likes);
        countEl.textContent = likes;

        // Bounce the count
        countEl.style.transform = 'scale(1.4)';
        setTimeout(() => { countEl.style.transform = 'scale(1)'; }, 200);

        // Pop animation on button
        btn.classList.remove('pop');
        void btn.offsetWidth; // reflow to restart animation
        btn.classList.add('pop');

        // Spawn floating hearts at click position
        const rect = btn.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top);
    });
})();
