// Collapsible sections.
//
// The class goes on the enclosing .metrics-section, because that is what the
// shared stylesheet keys its rules off:
//   .metrics-section.collapsed .metrics-section-content  -> collapsed and hidden
//   .metrics-section.collapsed .section-toggle-icon::before -> plus instead of minus
//
// Each title is wrapped in a real <button> inside its heading at load, rather
// than giving the heading's container role="button". A button role makes its
// contents presentational, which hid the titles from heading navigation. This
// way the heading stays a heading and the button inside it carries the state.
// Without JavaScript the sections simply stay open.
document.addEventListener('DOMContentLoaded', function () {
    const headers = document.querySelectorAll('.collapsible-header');

    // Toggle the section a trigger controls and keep aria-expanded in sync.
    function toggle(header, trigger) {
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

        trigger.setAttribute('aria-expanded', String(!collapsed));
    }

    // The heading is either inside the header container or is the header.
    function findHeading(header) {
        return header.querySelector('h2, h3, h4') || header;
    }

    // Move the heading's text and the toggle icon into a new button.
    function buildTrigger(header, heading) {
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'collapsible-trigger';

        const label = document.createElement('span');
        label.className = 'collapsible-label';
        while (heading.firstChild) {
            label.appendChild(heading.firstChild);
        }
        trigger.appendChild(label);

        const icon = header.querySelector('.section-toggle-icon');
        if (icon) {
            icon.setAttribute('aria-hidden', 'true');
            trigger.appendChild(icon);
        }

        const targetId = header.getAttribute('data-target');
        if (targetId) {
            trigger.setAttribute('aria-controls', targetId);
        }

        heading.appendChild(trigger);
        return trigger;
    }

    headers.forEach(header => {
        const trigger = buildTrigger(header, findHeading(header));
        const section = header.closest('.metrics-section');
        const startsCollapsed = section
            ? section.classList.contains('collapsed')
            : header.classList.contains('collapsed');
        trigger.setAttribute('aria-expanded', String(!startsCollapsed));

        // A native button already handles Enter and Space.
        trigger.addEventListener('click', function () {
            toggle(header, trigger);
        });
    });
});
