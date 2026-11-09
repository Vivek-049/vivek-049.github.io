const topbar = document.querySelector('.topbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation toggle
const setMenuOpen = (open) => {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};

navToggle.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('open'));
});

// Close mobile menu when a link is chosen
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

// Stronger nav background once the page scrolls
const updateTopbar = () => {
    topbar.classList.toggle('scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', updateTopbar, { passive: true });
updateTopbar();

// Highlight the nav link for the section in view
const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]')];

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// Reveal content as it scrolls into view
if (!reduceMotion) {
    document.documentElement.classList.add('js');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

// Cursor spotlight on cards
document.querySelectorAll('.spot').forEach(card => {
    card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
});

// Play looping demo clips only while they're on screen
if (!reduceMotion) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {});
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('video[data-autoplay]').forEach(video => videoObserver.observe(video));
}

// Copy email address
document.querySelectorAll('[data-copy]').forEach(button => {
    const label = button.querySelector('span');

    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(button.dataset.copy);
            label.textContent = 'Copied';
            button.classList.add('copied');
            setTimeout(() => {
                label.textContent = 'Copy';
                button.classList.remove('copied');
            }, 1600);
        } catch {
            window.location.href = `mailto:${button.dataset.copy}`;
        }
    });
});
