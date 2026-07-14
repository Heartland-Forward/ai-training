// Collapsible sections.
//
// The class goes on the enclosing .metrics-section, because that is what the
// shared dashboard stylesheet keys its rules off:
//   .metrics-section.collapsed .metrics-section-content  -> height 0, opacity 0
//   .metrics-section.collapsed .section-toggle-icon::before -> rotate(-135deg)
// Putting it anywhere else means writing our own collapse and our own chevron,
// which is how this file previously drifted from the design system.
document.addEventListener('DOMContentLoaded', function () {
    const headers = document.querySelectorAll('.collapsible-header');

    headers.forEach(header => {
        header.addEventListener('click', function () {
            const section = this.closest('.metrics-section');

            if (section) {
                section.classList.toggle('collapsed');
                return;
            }

            // Fallback for any collapsible not wrapped in a .metrics-section.
            const content = document.getElementById(this.getAttribute('data-target'));
            if (content) {
                content.classList.toggle('collapsed');
            }
            this.classList.toggle('collapsed');
        });
    });
});
