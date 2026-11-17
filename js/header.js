const headerScript = document.currentScript;

// A copy of components/header.html, used when that file cannot be fetched.
// Browsers block fetch() on pages opened straight from disk (file://), which
// used to leave those pages with no header at all. Keep this in step with
// components/header.html when the nav changes.
const HEADER_FALLBACK = `<header class="hf-header">
    <div class="hf-header-container">
        <div class="hf-header-left">
            <a href="/index.html" class="hf-logo-link">
                <img src="/images/branding/logo-white.png" alt="Heartland Forward" class="hf-logo">
            </a>
            <span class="hf-header-divider" aria-hidden="true"></span>
            <span class="hf-site-title">AI Training</span>
        </div>
        <button class="hf-menu-btn" aria-label="Toggle menu" aria-expanded="false">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
        <nav class="hf-nav">
            <a href="/index.html" class="hf-nav-link" data-page="index.html">Home</a>
            <a href="/pages/how-ai-works.html" class="hf-nav-link" data-page="how-ai-works.html">Understanding AI</a>
            <a href="/pages/resources.html" class="hf-nav-link" data-page="resources.html">Resources</a>
            <a href="/pages/prompts.html" class="hf-nav-link" data-page="prompts.html">Prompts</a>
            <a href="/pages/survey.html" class="hf-nav-link" data-page="survey.html">Survey</a>
        </nav>
    </div>
    <div class="hf-menu-overlay"></div>
</header>`;

async function fetchHeader(basePath) {
    try {
        const response = await fetch(basePath + '/components/header.html');
        if (!response.ok) {
            throw new Error('Failed to fetch header: ' + response.status);
        }
        return await response.text();
    } catch (error) {
        return HEADER_FALLBACK;
    }
}

async function loadHeader() {
    try {
        const scriptUrl = new URL(headerScript?.src || document.querySelector('script[src*="header.js"]').src);
        const basePath = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/js/'));

        let html = await fetchHeader(basePath);

        html = html.replace(/href="\//g, 'href="' + basePath + '/');
        html = html.replace(/src="\//g, 'src="' + basePath + '/');

        document.body.insertAdjacentHTML('afterbegin', html);

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const activeLink = document.querySelector(`.hf-nav-link[data-page="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('hf-nav-link-active');
        }

        initMobileMenu();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.hf-menu-btn');
    const nav = document.querySelector('.hf-nav');
    const overlay = document.querySelector('.hf-menu-overlay');

    if (!menuBtn || !nav || !overlay) return;

    function toggleMenu() {
        const isOpen = nav.classList.toggle('open');
        overlay.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
    }

    function closeMenu() {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    nav.querySelectorAll('.hf-nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}
