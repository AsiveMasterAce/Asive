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

// Technical approach modal interactions
const techModal = document.getElementById('tech-modal');
const closeTechModalBtn = document.getElementById('close-tech-modal');
const techModalBackdrop = document.getElementById('tech-modal-backdrop');
const techModalPanel = document.getElementById('tech-modal-panel');

let lastFocusedElement = null;
let closingTimeoutId = null;

if (techModal && closeTechModalBtn && techModalBackdrop && techModalPanel) {
    const openTechModal = () => {
        if (closingTimeoutId) {
            clearTimeout(closingTimeoutId);
            closingTimeoutId = null;
        }

        lastFocusedElement = document.activeElement;
        techModal.classList.remove('hidden');
        techModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        requestAnimationFrame(() => {
            techModalBackdrop.classList.remove('opacity-0');
            techModalBackdrop.classList.add('opacity-100');

            techModalPanel.classList.remove('opacity-0', 'translate-y-6', 'sm:translate-y-8', 'scale-[0.98]');
            techModalPanel.classList.add('opacity-100', 'translate-y-0', 'scale-100');

            closeTechModalBtn.focus();
        });
    };

    const closeTechModal = () => {
        techModalBackdrop.classList.remove('opacity-100');
        techModalBackdrop.classList.add('opacity-0');

        techModalPanel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
        techModalPanel.classList.add('opacity-0', 'translate-y-6', 'sm:translate-y-8', 'scale-[0.98]');

        techModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        closingTimeoutId = window.setTimeout(() => {
            techModal.classList.add('hidden');
            closingTimeoutId = null;

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }, 300);
    };

    document.addEventListener('click', (event) => {
        const openButton = event.target.closest('[id="open-tech-modal"], [data-modal-target="tech-modal"]');
        if (openButton) {
            event.preventDefault();
            openTechModal();
        }
    });

    closeTechModalBtn.addEventListener('click', closeTechModal);
    techModalBackdrop.addEventListener('click', closeTechModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !techModal.classList.contains('hidden')) {
            closeTechModal();
        }
    });
}
