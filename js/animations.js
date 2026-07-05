(function () {
    // Typewriter on the name — types once, then stops and "pops" larger.
    const NAME = "Shikhar Yadav";
    const twEl = document.getElementById('typewriter');
    const heroName = document.getElementById('heroName');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (twEl && heroName) {
        if (reduceMotion) {
            twEl.textContent = NAME;
            heroName.classList.add('grown', 'done');
        } else {
            let i = 0;
            function typeName() {
                i++;
                twEl.textContent = NAME.slice(0, i);
                if (i < NAME.length) {
                    setTimeout(typeName, 85);
                } else {
                    heroName.classList.add('done');
                    setTimeout(() => heroName.classList.add('grown'), 200);
                }
            }
            setTimeout(typeName, 400);
        }
    }

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => io.observe(el));
    }

    // "Say hi" pop + particle burst
    function spawnPop(el) {
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
        if (reduceMotion) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const container = document.createElement('div');
        container.className = 'particle-burst';
        const colors = ['#3ddc84', '#fbbf24', '#a78bfa', '#e7ecf5'];
        const n = 10;
        for (let i = 0; i < n; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
            const dist = 40 + Math.random() * 44;
            p.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
            p.style.setProperty('--dy', (Math.sin(angle) * dist) + 'px');
            p.style.left = cx + 'px';
            p.style.top = cy + 'px';
            p.style.background = colors[i % colors.length];
            container.appendChild(p);
        }
        document.body.appendChild(container);
        setTimeout(() => container.remove(), 700);
    }
    document.querySelectorAll('.js-say-hi').forEach(btn => {
        btn.addEventListener('click', () => spawnPop(btn));
    });
})();
