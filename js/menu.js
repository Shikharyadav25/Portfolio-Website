(function () {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    }

    // Ticker content (duplicated for seamless loop)
    const tickerData = [
        { label: 'STOCK-BULL', value: '76.38% ACC' },
        { label: 'CIVIC-CONNECT', value: 'LIVE' },
        { label: 'STATUS', value: 'OPEN TO WORK' },
        { label: 'DSA-TRACKER', value: 'TS + REACT' },
        { label: 'LITTLESHELL', value: 'C SYSTEMS' },
    ];
    const track = document.getElementById('tickerTrack');
    function buildTicker() {
        if (!track) return;
        let html = '';
        for (let i = 0; i < 2; i++) {
            tickerData.forEach(item => {
                html += `<span class="ticker-item"><span class="up">▲</span> <b>${item.label}</b> ${item.value}</span>`;
            });
        }
        track.innerHTML = html;
    }
    buildTicker();
})();
