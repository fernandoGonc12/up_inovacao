document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash');
    const main = document.getElementById('main-content');

    if (splash) {
        splash.addEventListener('animationend', (e) => {
            if (e.animationName === 'overlayFade') {
                splash.parentNode?.removeChild(splash);
                main?.classList.add('content-visible');
            }
        });

        // Fallback in case animationend doesn't fire
        setTimeout(() => {
            if (document.body.contains(splash)) {
                splash.parentNode.removeChild(splash);
                main?.classList.add('content-visible');
            }
        }, 2400);
    }

    // Smooth scroll for anchor nav links
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href'))
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Service card modal
    const modal       = document.getElementById('service-modal');
    const modalOverlay = modal?.querySelector('.service-modal-overlay');
    const modalTitle  = modal?.querySelector('.modal-title');
    const modalDesc   = modal?.querySelector('.modal-desc');
    const modalIcon   = modal?.querySelector('.modal-icon');
    const modalClose  = modal?.querySelector('.modal-close');
    const modalCta    = modal?.querySelector('.modal-cta');

    if (modalCta) modalCta.addEventListener('click', closeModal);

    let lastFocused = null;

    function openModal(card) {
        if (!modal) return;
        const title   = card.getAttribute('data-title') || card.querySelector('h3')?.innerText || '';
        const desc    = card.getAttribute('data-desc')  || card.querySelector('p')?.innerText  || '';
        const iconEl  = card.querySelector('.servico-icon');

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc)  modalDesc.textContent  = desc;
        if (modalIcon && iconEl) modalIcon.innerHTML = iconEl.innerHTML;

        lastFocused = document.activeElement || card;

        if ('inert' in modal) modal.inert = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modal.classList.add('open'));
        modalClose?.focus();
    }

    function closeModal() {
        if (!modal) return;
        try {
            if (lastFocused?.focus && document.contains(lastFocused)) {
                lastFocused.focus();
            }
        } catch (_) {}

        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if ('inert' in modal) modal.inert = true;
        document.body.style.overflow = '';
        lastFocused = null;
    }

    document.querySelectorAll('.servico-card').forEach(card => {
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose)   modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
