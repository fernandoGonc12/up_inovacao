document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash');
    const main = document.getElementById('main-content');

    if (splash) {
        // When the overlay's fade animation ends, remove it and reveal content
        splash.addEventListener('animationend', (e) => {
            if (e.animationName === 'overlayFade') {
                if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
                if (main) main.classList.add('content-visible');
            }
        });

        // Fallback in case animationend doesn't fire
        setTimeout(() => {
            if (document.body.contains(splash)) {
                splash.parentNode.removeChild(splash);
                if (main) main.classList.add('content-visible');
            }
        }, 2400);
    }

    // Smooth scroll behavior for nav links
    const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function smoothScrollTo(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', smoothScrollTo);
    });

    // Service card modal behavior
    const serviceCards = document.querySelectorAll('.servico-card');
    const modal = document.getElementById('service-modal');
    const modalOverlay = modal ? modal.querySelector('.service-modal-overlay') : null;
    const modalCard = modal ? modal.querySelector('.service-modal-card') : null;
    const modalTitle = modal ? modal.querySelector('.modal-title') : null;
    const modalDesc = modal ? modal.querySelector('.modal-desc') : null;
    const modalIcon = modal ? modal.querySelector('.modal-icon') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;

    function openModalFromCard(card) {
        if (!modal) return;
        const title = card.getAttribute('data-title') || card.querySelector('h3')?.innerText || '';
        const desc = card.getAttribute('data-desc') || card.querySelector('p')?.innerText || '';
        const icon = card.getAttribute('data-icon') || card.querySelector('.servico-icon')?.innerText || '';

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalIcon) modalIcon.textContent = icon;

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // small delay for transition
        requestAnimationFrame(() => modal.classList.add('open'));
        // focus close button for accessibility
        if (modalClose) modalClose.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openModalFromCard(card));
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});