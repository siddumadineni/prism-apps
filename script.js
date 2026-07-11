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
async function fetchLatestAppInfo() {
    try {
        const response = await fetch('/update.json');
        if (response.ok) {
            const data = await response.json();
            
            // 1. Update the Download button URL
            const downloadBtn = document.querySelector('.app-card .download');
            if (downloadBtn && data.downloadUrl) {
                downloadBtn.href = data.downloadUrl;
            }
            
            // 2. Display the version number as a premium badge next to the title
            const appTitle = document.querySelector('.app-card h2');
            if (appTitle) {
                // Clear any existing version tag to prevent duplication
                const existingBadge = appTitle.querySelector('.version-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                appTitle.innerHTML += ` <span class="version-badge" style="font-size: 13.5px; color: #ff7a00; margin-left: 8px; font-weight: 600; background: rgba(255, 122, 0, 0.1); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255, 122, 0, 0.2);">v${data.latestVersion}</span>`;
            }
        }
    } catch (e) {
        console.error('Failed to load update.json:', e);
    }
}

document.addEventListener('DOMContentLoaded', fetchLatestAppInfo);