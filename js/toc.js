// "On this page" navigation for long pages.
//
// Put an empty <nav class="toc" data-toc="#scope" aria-label="On this page">
// next to the page's content. This script fills it from the content inside
// #scope:
//   .toc-group         a group heading (its h2 text, or data-toc-label)
//   .metrics-section   a collapsible card (its heading text, or data-toc-label)
//
// It also:
//   - gives each card an id from its data-target ("connectors-content" ->
//     "connectors"), so #connectors works as a deep link from anywhere
//   - opens a collapsed card before jumping to it, from the list or a hash
//   - highlights the card you are reading
//   - adds Expand all / Collapse all
//
// Load it after collapsible.js, which builds the card buttons this script
// clicks. Without JavaScript there is no list and every card stays open, so
// the page still reads top to bottom.
document.addEventListener('DOMContentLoaded', function () {
    const toc = document.querySelector('.toc[data-toc]');
    if (!toc) return;

    const scope = document.querySelector(toc.getAttribute('data-toc'));
    if (!scope) return;

    const ICON_CHEVRON =
        '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';

    function slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function labelFor(el) {
        if (el.dataset.tocLabel) return el.dataset.tocLabel;
        const heading = el.querySelector('h2, h3');
        if (!heading) return '';
        // Leave out the one-line hint some card titles carry.
        const copy = heading.cloneNode(true);
        copy.querySelectorAll('.card-hint').forEach(function (hint) { hint.remove(); });
        return copy.textContent.replace(/\s+/g, ' ').trim();
    }

    // Open a collapsed card through its own button, so aria-expanded and the
    // plus/minus icon stay in sync with collapsible.js.
    function setOpen(section, open) {
        if (!section.classList.contains('metrics-section')) return;
        const isCollapsed = section.classList.contains('collapsed');
        if (open === isCollapsed) {
            const trigger = section.querySelector('.collapsible-trigger');
            if (trigger) trigger.click();
        }
    }

    // Collect entries in document order and make sure each has an id.
    const entries = [];
    const used = new Set();
    scope.querySelectorAll('.toc-group, .metrics-section').forEach(function (el) {
        if (!el.id) {
            const header = el.querySelector('.collapsible-header');
            const target = header && header.getAttribute('data-target');
            let id = target ? target.replace(/-content$/, '') : slugify(labelFor(el));
            while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== el)) {
                id += '-section';
            }
            el.id = id;
        }
        used.add(el.id);
        entries.push({ el: el, group: el.classList.contains('toc-group'), label: labelFor(el) });
    });

    if (!entries.length) return;

    // Build the list.
    const list = document.createElement('ol');
    const linkById = {};
    entries.forEach(function (entry) {
        const li = document.createElement('li');
        if (entry.group) {
            li.className = 'toc-group-label';
            li.textContent = entry.label;
        } else {
            const a = document.createElement('a');
            a.href = '#' + entry.el.id;
            a.textContent = entry.label;
            li.appendChild(a);
            linkById[entry.el.id] = a;
        }
        list.appendChild(li);
    });

    const bodyId = 'toc-body';
    toc.innerHTML =
        '<button type="button" class="toc-toggle" aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<span>On this page</span>' + ICON_CHEVRON + '</button>' +
        '<div class="toc-body" id="' + bodyId + '"><p class="toc-title">On this page</p></div>';

    const body = toc.querySelector('.toc-body');
    body.appendChild(list);

    const cards = entries.filter(function (e) { return !e.group; }).map(function (e) { return e.el; });
    if (cards.some(function (c) { return c.classList.contains('metrics-section'); })) {
        const actions = document.createElement('div');
        actions.className = 'toc-actions';
        actions.innerHTML =
            '<button type="button" class="btn btn-secondary btn-small" data-toc-all="open">Expand all</button>' +
            '<button type="button" class="btn btn-secondary btn-small" data-toc-all="close">Collapse all</button>';
        body.appendChild(actions);
        actions.addEventListener('click', function (event) {
            const button = event.target.closest('[data-toc-all]');
            if (!button) return;
            const open = button.getAttribute('data-toc-all') === 'open';
            cards.forEach(function (card) { setOpen(card, open); });
        });
    }

    // Small screens: the list folds into a bar above the content.
    const toggle = toc.querySelector('.toc-toggle');
    toggle.addEventListener('click', function () {
        const open = toc.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    // Jumping to a card opens it first, and closes the small-screen list.
    list.addEventListener('click', function (event) {
        const link = event.target.closest('a');
        if (!link) return;
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (target) setOpen(target, true);
        if (toc.classList.contains('is-open')) {
            toc.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Deep links: #connectors opens and scrolls to that card.
    function openFromHash() {
        if (!location.hash) return;
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (!target) return;
        const section = target.closest('.metrics-section');
        if (section) setOpen(section, true);
        target.scrollIntoView();
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    // Highlight the last card whose top has scrolled past the reading line.
    let ticking = false;
    function updateActive() {
        ticking = false;
        const line = 140;
        let current = null;
        cards.forEach(function (card) {
            if (card.getBoundingClientRect().top <= line) current = card;
        });
        if (!current) current = cards[0];
        Object.keys(linkById).forEach(function (id) {
            const active = current && id === current.id;
            linkById[id].classList.toggle('is-active', active);
            if (active) {
                linkById[id].setAttribute('aria-current', 'location');
            } else {
                linkById[id].removeAttribute('aria-current');
            }
        });
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateActive);
        }
    }, { passive: true });
    updateActive();
});
