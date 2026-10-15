/* ==========================================
   My Apps
   Premium Script
========================================== */

/* ===========
   Counter
=========== */

function animateCounter(id, target, duration = 1200) {

    const element = document.getElementById(id);

    if (!element) return;

    let start = 0;

    const increment = target / (duration / 16);

    function update() {

        start += increment;

        if (start >= target) {

            element.textContent = target;

            return;

        }

        element.textContent = Math.floor(start);

        requestAnimationFrame(update);

    }

    update();

}

animateCounter("appsCount", 1);
animateCounter("updateCount", 12);

/* ======================
   Scroll Reveal
====================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll(".app-card, .coming-card, .stat")
    .forEach((element) => {

        element.classList.add("hidden");

        observer.observe(element);

    });

/* ======================
   Button Ripple Effect
====================== */

document.querySelectorAll(".download, .website, .primary-btn, .secondary-btn")
.forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        ripple.className = "ripple";

        const rect = this.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + "px";

        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";

        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

/* ======================
   Navbar Shadow
====================== */

window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");

    if (window.scrollY > 20) {

        nav.style.background = "rgba(6,8,24,.65)";
        nav.style.backdropFilter = "blur(18px)";
        nav.style.border = "1px solid rgba(255,255,255,.08)";
        nav.style.borderRadius = "18px";
        nav.style.padding = "18px 24px";
        nav.style.marginTop = "15px";

    } else {

        nav.style.background = "transparent";
        nav.style.backdropFilter = "none";
        nav.style.border = "none";
        nav.style.padding = "30px 0";
        nav.style.marginTop = "0";

    }

});

/* ==========================================
   Fetch Latest Version & Download URL
   ========================================== */

const POP_MUSIC_JSON_URL = 'https://pub-3ccbcbc9a4c047eb8f027194eb5f2a3f.r2.dev/pop-music.json';
const R2_BASE_URL = 'https://pub-3ccbcbc9a4c047eb8f027194eb5f2a3f.r2.dev/';

async function fetchLatestAppInfo() {
    let data = null;

    // 1. Try fetching directly from Cloudflare R2
    try {
        const response = await fetch(POP_MUSIC_JSON_URL + '?t=' + Date.now());
        if (response.ok) {
            data = await response.json();
        }
    } catch (e) {
        // Direct fetch failed (e.g. CORS restriction)
    }

    // 2. If direct fetch failed, try same-origin update.json
    if (!data) {
        try {
            const localResponse = await fetch('update.json?t=' + Date.now());
            if (localResponse.ok) {
                const localData = await localResponse.json();
                data = {
                    versionName: localData.latestVersion,
                    versionCode: localData.buildNumber,
                    downloadUrl: localData.downloadUrl
                };
            }
        } catch (e) {
            // Local fetch failed
        }
    }

    // 3. Fallback to CORS proxy if still not resolved
    if (!data) {
        try {
            const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(POP_MUSIC_JSON_URL)}&t=${Date.now()}`);
            if (proxyRes.ok) {
                data = await proxyRes.json();
            }
        } catch (e) {}
    }

    if (!data) return;

    try {
        // 1. Build the full APK download URL
        const downloadBtn = document.getElementById('popMusicDownload') || document.querySelector('.app-card .download');
        let downloadUrl = data.downloadUrl;
        if (!downloadUrl && data.apkFile) {
            downloadUrl = data.apkFile.startsWith('http') ? data.apkFile : R2_BASE_URL + data.apkFile;
        }

        if (downloadBtn && downloadUrl) {
            downloadBtn.href = downloadUrl;
            downloadBtn.setAttribute('target', '_blank');
        }

        // 2. Display the version number as a premium badge next to the title
        const appTitle = document.querySelector('.app-card h2');
        if (appTitle) {
            const existingBadge = appTitle.querySelector('.version-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            const versionText = data.versionName || data.latestVersion || '';
            if (versionText) {
                const badge = document.createElement('span');
                badge.className = 'version-badge';
                badge.style.fontSize = '13.5px';
                badge.style.color = '#ff7a00';
                badge.style.marginLeft = '8px';
                badge.style.fontWeight = '600';
                badge.style.background = 'rgba(255, 122, 0, 0.1)';
                badge.style.padding = '4px 10px';
                badge.style.borderRadius = '12px';
                badge.style.border = '1px solid rgba(255, 122, 0, 0.2)';
                badge.textContent = `v${versionText}`;
                appTitle.appendChild(badge);
            }
        }
    } catch (e) {
        console.error('Failed to process Pop Music update info:', e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchLatestAppInfo);
} else {
    fetchLatestAppInfo();
}