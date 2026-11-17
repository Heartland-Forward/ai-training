// Copy buttons for prompts.
//
// Markup: <button type="button" class="copy-btn" data-copy="ID" hidden>
// where ID is the element holding the text to copy. The buttons ship hidden
// so they only appear when this script can make them work. A polite live
// region announces "Copied" for screen-reader users.
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('[data-copy]');
    if (!buttons.length) return;

    const live = document.createElement('div');
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    const ICON_COPY =
        '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
    const ICON_CHECK =
        '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>';

    // Older browsers, or pages opened from a file, may not allow the
    // Clipboard API; fall back to selecting the text and copying it.
    function fallbackCopy(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(area);
        return ok;
    }

    buttons.forEach(function (button) {
        const source = document.getElementById(button.getAttribute('data-copy'));
        if (!source) return;

        const name = button.getAttribute('data-copy-name') || 'prompt';
        button.innerHTML = ICON_COPY + '<span>Copy</span>';
        button.setAttribute('aria-label', 'Copy the ' + name);
        button.hidden = false;

        let timer;
        button.addEventListener('click', async function () {
            const text = source.innerText.trim();
            let ok = false;
            try {
                await navigator.clipboard.writeText(text);
                ok = true;
            } catch (e) {
                ok = fallbackCopy(text);
            }

            clearTimeout(timer);
            if (ok) {
                button.classList.add('is-copied');
                button.innerHTML = ICON_CHECK + '<span>Copied</span>';
                live.textContent = 'Copied the ' + name + '.';
            } else {
                live.textContent = 'Copy did not work. Select the text and copy it yourself.';
            }
            timer = setTimeout(function () {
                button.classList.remove('is-copied');
                button.innerHTML = ICON_COPY + '<span>Copy</span>';
                live.textContent = '';
            }, 2000);
        });
    });
});
