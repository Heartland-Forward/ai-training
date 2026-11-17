// Home page motion.
//
// 1. Cards fade up as they scroll into view (.reveal).
// 2. The hero chat demo types the advisor's message, shows a "thinking"
//    pause, then shows the reply. It plays once, so nothing keeps moving.
//
// Loaded in <head> without defer so the js-reveal class lands before the
// first paint (no flash of cards that then hide). Anyone who prefers reduced
// motion, or a browser without IntersectionObserver, gets the finished page
// with no animation. Without JavaScript everything is simply visible.
(function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canReveal = !reduce && 'IntersectionObserver' in window;

    if (canReveal) {
        document.documentElement.classList.add('js-reveal');
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (canReveal) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });

            document.querySelectorAll('.reveal').forEach(function (el) {
                observer.observe(el);
            });
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
