// Collapsible sections.
//
// The class goes on the enclosing .metrics-section, because that is what the
// shared dashboard stylesheet keys its rules off:
//   .metrics-section.collapsed .metrics-section-content  -> height 0, opacity 0
//   .metrics-section.collapsed .section-toggle-icon::before -> rotate(-135deg)
// Putting it anywhere else means writing our own collapse and our own chevron,
// which is how this file previously drifted from the design system.
//
// The headers are plain divs in the markup, so accessibility (button role,
// focusability, aria-expanded, keyboard activation) is added here at runtime
// rather than in every page's HTML. A keyboard or screen-reader user gets a
// real, operable, state-announcing control.
document.addEventListener('DOMContentLoaded', function () {
    const headers = document.querySelectorAll('.collapsible-header');

    // Toggle a header's section and keep aria-expanded in sync.
    function toggle(header) {
        const section = header.closest('.metrics-section');
        let collapsed;

        if (section) {
            collapsed = section.classList.toggle('collapsed');
        } else {
            // Fallback for any collapsible not wrapped in a .metrics-section.
            const content = document.getElementById(header.getAttribute('data-target'));
            if (content) {
                content.classList.toggle('collapsed');
            }
            collapsed = header.classList.toggle('collapsed');
        }

        header.setAttribute('aria-expanded', String(!collapsed));
    }

    headers.forEach(header => {
        // Make the div behave as a button for assistive tech and keyboards.
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        const section = header.closest('.metrics-section');
        const startsCollapsed = section
            ? section.classList.contains('collapsed')
            : header.classList.contains('collapsed');
        header.setAttribute('aria-expanded', String(!startsCollapsed));

        header.addEventListener('click', function () {
            toggle(this);
        });

        // Enter and Space activate a button; Space must not scroll the page.
        header.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                toggle(this);
            }
        });
    });
});
