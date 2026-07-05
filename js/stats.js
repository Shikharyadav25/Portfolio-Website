(function () {
    /* ---------------- LIVE CODING PROFILE DATA ---------------- */
    function fallbackHTML(url) {
        return `<p class="live-fallback">Live data unavailable right now — <a href="${url}" target="_blank" rel="noopener">view profile ↗</a></p>`;
    }

    async function loadLeetCode() {
        const el = document.getElementById('lc-body');
        if (!el) return;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 8000);
            const res = await fetch('https://leetcode-api-faisal.vercel.app/shikharyadav07', { signal: controller.signal });
            clearTimeout(t);
            if (!res.ok) throw new Error('bad status');
            const d = await res.json();
            if (d.totalSolved === undefined) throw new Error('bad payload');
            const e = d.easySolved || 0, m = d.mediumSolved || 0, h = d.hardSolved || 0;
            const te = d.totalEasy || 0, tm = d.totalMedium || 0, th = d.totalHard || 0;
            const sum = (e + m + h) || 1;
            el.innerHTML = `
    <div class="stat-big">${d.totalSolved}<span>/ ${d.totalQuestions} solved</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:${e / sum * 100}%"></div>
      <div class="seg seg-m" style="width:${m / sum * 100}%"></div>
      <div class="seg seg-h" style="width:${h / sum * 100}%"></div>
    </div>
    <div class="seg-legend">
      <span><i class="dot-e"></i>Easy ${e}/${te}</span>
      <span><i class="dot-m"></i>Medium ${m}/${tm}</span>
      <span><i class="dot-h"></i>Hard ${h}/${th}</span>
    </div>`;
        } catch (err) {
            el.innerHTML = `
    <div class="stat-big">110<span>/ 3985 solved</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:40.9%"></div>
      <div class="seg seg-m" style="width:54.5%"></div>
      <div class="seg seg-h" style="width:4.6%"></div>
    </div>
    <div class="seg-legend" style="margin-bottom: 12px;">
      <span><i class="dot-e"></i>Easy 45/953</span>
      <span><i class="dot-m"></i>Medium 60/2081</span>
      <span><i class="dot-h"></i>Hard 5/951</span>
    </div>
    <p class="live-fallback" style="font-size: 11px; color: var(--text-faint);">Cached data (platform unreachable) — <a href="https://leetcode.com/shikharyadav07" target="_blank" rel="noopener" style="color: var(--green); border-bottom: 1px solid rgba(61,220,132,.4);">view profile ↗</a></p>`;
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
            el.innerHTML = `
    <div class="stat-big">894<span>Newbie</span></div>
    <div class="sparkline-container" style="height: 54px; margin-top: 4px;"></div>
    <p class="live-fallback" style="font-size: 11px; color: var(--text-faint); margin-top: 12px;">Cached data (platform unreachable) — <a href="https://codeforces.com/profile/shikharyadav595" target="_blank" rel="noopener" style="color: var(--green); border-bottom: 1px solid rgba(61,220,132,.4);">view profile ↗</a></p>`;
        }
    }

    async function loadCodeChef() {
        const el = document.getElementById('cc-body');
        if (!el) return;
        try {
            const controller = new AbortController();
            const t = setTimeout(() => controller.abort(), 8000);
            const res = await fetch('https://codechef-api.onrender.com/api/shikhar_77', { signal: controller.signal });
            clearTimeout(t);
            const d = await res.json();
            if (!d.rating || d.rating === "NA") throw new Error('bad payload');
            const rating = parseInt(d.rating) || 1425;
            const highest = parseInt(d.highestRating) || rating;
            const pct = Math.max(6, Math.min(100, (rating / highest) * 100));
            el.innerHTML = `
    <div class="stat-big">${rating}<span>${d.stars || ''} · highest ${highest}</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:${pct}%"></div>
    </div>`;
        } catch (err) {
            el.innerHTML = `
    <div class="stat-big">1425<span>★★ · highest 1425</span></div>
    <div class="seg-bar">
      <div class="seg seg-e" style="width:100%"></div>
    </div>
    <p class="live-fallback" style="font-size: 11px; color: var(--text-faint); margin-top: 12px;">Cached data (platform unreachable) — <a href="https://www.codechef.com/users/shikhar_77" target="_blank" rel="noopener" style="color: var(--green); border-bottom: 1px solid rgba(61,220,132,.4);">view profile ↗</a></p>`;
        }
    }

    loadLeetCode();
    loadCodeforces();
    loadCodeChef();
})();
