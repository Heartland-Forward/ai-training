// Site-wide motion.
//
// 1. Section headings, cards, and callouts fade up as they scroll into view.
//    The CSS hides them only under html.js-reveal, which this file sets, so
//    without JavaScript (or without IntersectionObserver) nothing is hidden.
// 2. On the home page, the hero chat window types the advisor's message,
//    shows a "thinking" pause, then the reply. It plays once.
//
// Loaded in <head> without defer so js-reveal lands before the first paint,
// which avoids cards flashing in and then hiding. Anyone who prefers reduced
// motion gets the finished page with no animation.
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canReveal = !reduce && 'IntersectionObserver' in window;

    // Everything that fades in. Matches the selectors in style.css.
    var REVEAL = [
        '.reveal',
        '.summary-section .section-header',
        '.card-stack > .metrics-section',
        '.page-with-toc .container > .callout',
        '.summary-section .chart-card',
        '.home-start-heading',
        '.prompts-more'
    ].join(', ');

    if (canReveal) {
        document.documentElement.classList.add('js-reveal');
    }

    // Safety net: if the browser isn't drawing frames (a background tab, a
    // hidden preview pane), entrance animations and the observer can stall
    // and leave content invisible. Two seconds after load, show everything
    // and switch the entrance animations off. In a normal tab they have long
    // finished by then, so nothing visibly changes.
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.documentElement.classList.add('motion-done');
            document.querySelectorAll(REVEAL).forEach(function (el) {
                el.classList.add('is-visible');
            });
        }, 2000);
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (canReveal) {
            var targets = document.querySelectorAll(REVEAL);

            // Stagger cards within a stack, a little at a time.
            document.querySelectorAll('.card-stack').forEach(function (stack) {
                Array.prototype.forEach.call(stack.children, function (card, i) {
                    card.style.setProperty('--delay', Math.min(i, 6) * 60 + 'ms');
                });
            });

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });

            targets.forEach(function (el) {
                observer.observe(el);
            });

            // A deep link (#canva) can land on a card before it has faded in.
            if (location.hash) {
                var hashTarget = document.getElementById(decodeURIComponent(location.hash.slice(1)));
                var card = hashTarget && hashTarget.closest('.metrics-section');
                if (card) card.classList.add('is-visible');
            }
        }

        var demo = document.querySelector('.chat-demo');
        if (!demo || reduce) return;

        var typed = demo.querySelector('.chat-typed');
        var text = typed ? typed.getAttribute('data-text') : '';
        if (!typed || !text) return;

        demo.classList.add('is-animated', 'is-typing');
        typed.textContent = '';

        var i = 0;
        function tick() {
            i += 1;
            typed.textContent = text.slice(0, i);
            if (i < text.length) {
                setTimeout(tick, 26);
                return;
            }
            demo.classList.remove('is-typing');
            demo.classList.add('is-thinking');
            setTimeout(function () {
                demo.classList.remove('is-thinking');
                demo.classList.add('is-replied');
            }, 1100);
        }
        setTimeout(tick, 600);
    });
})();
