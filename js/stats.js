(function () {
    /* ---------------- LIVE CODING PROFILE DATA ---------------- */
    function fallbackHTML(url) {
        return `<p class="live-fallback">Live data unavailable right now — <a href="${url}" target="_blank" rel="noopener">view profile ↗</a></p>`;
    }

    function withTimeout(promise, ms) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), ms);
        return { signal: controller.signal, done: promise.finally(() => clearTimeout(t)) };
    }

    async function loadLeetCode() {
        const el = document.getElementById('lc-body');
        if (!el) return;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 8000);
            const res = await fetch('https://leetcode-stats-api.herokuapp.com/shikharyadav07', { signal: controller.signal });
            clearTimeout(t);
            if (!res.ok) throw new Error('bad status');
            const d = await res.json();
            if (d.status !== 'success') throw new Error('bad payload');
            const e = d.easySolved || 0, m = d.mediumSolved || 0, h = d.hardSolved || 0;
            const sum = (e + m + h) || 1;
            el.innerHTML = `
    <div class="stat-big">${d.totalSolved}<span>/ ${d.totalQuestions} solved</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:${e / sum * 100}%"></div>
      <div class="seg seg-m" style="width:${m / sum * 100}%"></div>
      <div class="seg seg-h" style="width:${h / sum * 100}%"></div>
    </div>
    <div class="seg-legend">
      <span><i class="dot-e"></i>Easy ${e}</span>
      <span><i class="dot-m"></i>Medium ${m}</span>
      <span><i class="dot-h"></i>Hard ${h}</span>
    </div>`;
        } catch (err) {
            el.innerHTML = fallbackHTML('https://leetcode.com/shikharyadav07');
        }
    }

    function buildSparkline(vals) {
        const w = 220, h = 54, pad = 4;
        const min = Math.min(...vals), max = Math.max(...vals);
        const range = (max - min) || 1;
        const stepX = (w - 2 * pad) / ((vals.length - 1) || 1);
        const pts = vals.map((v, i) => {
            const x = pad + i * stepX;
            const y = h - pad - ((v - min) / range) * (h - 2 * pad);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
  <polyline points="${pts}" fill="none" stroke="#5ea5f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    }

    async function loadCodeforces() {
        const el = document.getElementById('cf-body');
        if (!el) return;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 8000);
            const infoRes = await fetch('https://codeforces.com/api/user.info?handles=shikharyadav595', { signal: controller.signal });
            clearTimeout(t);
            const info = await infoRes.json();
            if (info.status !== 'OK') throw new Error('bad info');
            const u = info.result[0];
            const rankLabel = (u.rank || 'unrated').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            let html = `<div class="stat-big">${u.rating ?? '—'}<span>${rankLabel}</span></div>`;
            try {
                const ratRes = await fetch('https://codeforces.com/api/user.rating?handle=shikharyadav595');
                const rat = await ratRes.json();
                if (rat.status === 'OK' && rat.result.length > 1) {
                    html += buildSparkline(rat.result.map(x => x.newRating));
                }
            } catch (e) { /* sparkline is optional */ }
            el.innerHTML = html;
        } catch (err) {
            el.innerHTML = fallbackHTML('https://codeforces.com/profile/shikharyadav595');
        }
    }

    async function loadCodeChef() {
        const el = document.getElementById('cc-body');
        if (!el) return;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 8000);
            const res = await fetch('https://codechef-api.vercel.app/handle/shikhar_77', { signal: controller.signal });
            clearTimeout(t);
            const d = await res.json();
            if (d.success === false || !d.currentRating) throw new Error('bad payload');
            const highest = d.highestRating || d.currentRating;
            const pct = Math.max(6, Math.min(100, (d.currentRating / highest) * 100));
            el.innerHTML = `
    <div class="stat-big">${d.currentRating}<span>${d.stars || ''} · highest ${highest}</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:${pct}%"></div>
    </div>`;
        } catch (err) {
            el.innerHTML = fallbackHTML('https://www.codechef.com/users/shikhar_77');
        }
    }

    loadLeetCode();
    loadCodeforces();
    loadCodeChef();
})();
