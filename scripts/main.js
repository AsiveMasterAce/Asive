// Mobile menu toggle
const menuBtn  = document.getElementById('menu-btn');
const menuIcon = document.getElementById('menu-icon');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.replace('fa-times', 'fa-bars');
}

menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    if (isOpen) {
        closeMobileMenu();
    } else {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.replace('fa-bars', 'fa-times');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu and add shadow on scroll
window.addEventListener('scroll', () => {
    closeMobileMenu();
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));

// Technical approach modal interactions (supports multiple modals)
const modals = document.querySelectorAll('[data-modal]');
const closingTimeoutByModal = new WeakMap();
let activeModal = null;
let lastFocusedElement = null;

function getModalParts(modal) {
    return {
        backdrop: modal.querySelector('[data-modal-backdrop]'),
        panel: modal.querySelector('[data-modal-panel]'),
        closeButton: modal.querySelector('[data-modal-close]')
    };
}

function openModal(modal) {
    const { backdrop, panel, closeButton } = getModalParts(modal);
    if (!backdrop || !panel) {
        return;
    }

    const existingTimer = closingTimeoutByModal.get(modal);
    if (existingTimer) {
        clearTimeout(existingTimer);
        closingTimeoutByModal.delete(modal);
    }

    if (activeModal && activeModal !== modal) {
        activeModal.classList.add('hidden');
        activeModal.setAttribute('aria-hidden', 'true');
    }

    lastFocusedElement = document.activeElement;
    activeModal = modal;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');

        panel.classList.remove('opacity-0', 'translate-y-6', 'sm:translate-y-8', 'scale-[0.98]');
        panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');

        if (closeButton) {
            closeButton.focus();
        }
    });
}

function closeModal(modal) {
    const { backdrop, panel } = getModalParts(modal);
    if (!backdrop || !panel) {
        return;
    }

    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');

    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    panel.classList.add('opacity-0', 'translate-y-6', 'sm:translate-y-8', 'scale-[0.98]');

    modal.setAttribute('aria-hidden', 'true');

    const timeoutId = window.setTimeout(() => {
        modal.classList.add('hidden');
        closingTimeoutByModal.delete(modal);

        if (activeModal === modal) {
            activeModal = null;
            document.body.classList.remove('modal-open');

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }
    }, 300);

    closingTimeoutByModal.set(modal, timeoutId);
}

if (modals.length > 0) {
    document.addEventListener('click', (event) => {
        const openButton = event.target.closest('[data-modal-target]');
        if (openButton) {
            const targetId = openButton.getAttribute('data-modal-target');
            const targetModal = targetId ? document.getElementById(targetId) : null;

            if (targetModal) {
                event.preventDefault();
                openModal(targetModal);
            }
            return;
        }

        const closeButton = event.target.closest('[data-modal-close]');
        if (closeButton) {
            const modal = closeButton.closest('[data-modal]');
            if (modal) {
                closeModal(modal);
            }
            return;
        }

        const backdrop = event.target.closest('[data-modal-backdrop]');
        if (backdrop) {
            const modal = backdrop.closest('[data-modal]');
            if (modal) {
                closeModal(modal);
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeModal && !activeModal.classList.contains('hidden')) {
            closeModal(activeModal);
        }
    });
}
