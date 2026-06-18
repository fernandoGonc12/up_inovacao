document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const splash = document.getElementById('splash');
    const main = document.getElementById('main-content');

    if (splash) {
        if (reduceMotion) {
            // Sem animação: mostra o conteúdo imediatamente
            splash.parentNode?.removeChild(splash);
            main?.classList.add('content-visible');
        } else {
            splash.addEventListener('animationend', (e) => {
                if (e.animationName === 'overlayFade') {
                    splash.parentNode?.removeChild(splash);
                    main?.classList.add('content-visible');
                }
            });

            // Fallback caso o animationend não dispare
            setTimeout(() => {
                if (document.body.contains(splash)) {
                    splash.parentNode.removeChild(splash);
                    main?.classList.add('content-visible');
                }
            }, 900);
        }
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
    const modalInfo   = modal?.querySelector('.modal-info');

    if (modalCta) modalCta.addEventListener('click', closeModal);

    let lastFocused = null;

    function openModal(card) {
        if (!modal) return;
        const title   = card.getAttribute('data-title') || card.querySelector('h3')?.innerText || '';
        const desc    = card.getAttribute('data-desc')  || card.querySelector('p')?.innerText  || '';
        const iconEl  = card.querySelector('.servico-icon');
        const cardBtn = card.querySelector('.card-btn');

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc)  modalDesc.textContent  = desc;
        if (modalIcon && iconEl) modalIcon.innerHTML = iconEl.innerHTML;
        if (modalInfo && cardBtn) modalInfo.href = cardBtn.href;

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
        card.querySelector('.card-btn')?.addEventListener('click', (e) => e.stopPropagation());
    });

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (modalClose)   modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ── Formulário de diagnóstico → WhatsApp (+ e-mail alternativo) ──
    const WHATSAPP_NUM = '5567992641136';
    const EMAIL_DESTINO = 'contato@upinovacaotec.com.br';

    function getLead(form) {
        const get = (n) => (form.querySelector(`[name="${n}"]`)?.value || '').trim();
        return {
            nome: get('nome'),
            empresa: get('empresa'),
            telefone: get('telefone'),
            desafio: get('desafio')
        };
    }

    function leadMessage(d) {
        return 'Olá! Vim pelo site da UP e gostaria de agendar um diagnóstico gratuito.\n\n'
            + `Nome: ${d.nome}\n`
            + `Empresa: ${d.empresa}\n`
            + `Telefone: ${d.telefone}\n`
            + `Principal desafio: ${d.desafio}`;
    }

    document.querySelectorAll('.form-diagnostico').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const d = getLead(form);
            const url = `https://wa.me/${WHATSAPP_NUM}?text=` + encodeURIComponent(leadMessage(d));
            window.trackEvent?.('form_submit_whatsapp', { empresa: d.empresa });
            window.open(url, '_blank', 'noopener');
        });

        // Alternativa por e-mail com os mesmos dados preenchidos
        const mailto = form.querySelector('.form-mailto');
        if (mailto) {
            mailto.addEventListener('click', () => {
                const d = getLead(form);
                const subject = 'Diagnóstico gratuito — ' + (d.empresa || 'site UP');
                mailto.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(subject)}`
                    + `&body=${encodeURIComponent(leadMessage(d))}`;
                window.trackEvent?.('form_submit_email', { empresa: d.empresa });
            });
        }
    });

    // ── Faixa de parceiros: clona os logos para um loop infinito sem falhas ──
    // Cada metade precisa ser mais larga que a tela; medimos no 'load' (imagens
    // já com largura) e repetimos o conjunto um número par de vezes (metades
    // idênticas), garantindo emenda invisível no translateX(-50%).
    function preencherParceiros() {
        const track = document.querySelector('.parceiros-track');
        if (!track || track.dataset.filled) return;
        const unitHTML = track.innerHTML;
        const unitWidth = track.scrollWidth || 1;
        const alvo = Math.max(window.innerWidth, 1920);
        const unidadesPorMetade = Math.max(2, Math.ceil(alvo / unitWidth));
        track.innerHTML = unitHTML.repeat(unidadesPorMetade * 2);
        // Mantém só o primeiro conjunto anunciado a leitores de tela
        track.querySelectorAll('.parceiros-logo').forEach((img, i) => {
            if (i >= 4) img.setAttribute('aria-hidden', 'true');
        });
        track.dataset.filled = '1';
    }
    if (document.querySelector('.parceiros-track')) {
        // Roda já (imagens em cache têm largura) e de novo no 'load' como
        // garantia (idempotente via dataset.filled).
        preencherParceiros();
        window.addEventListener('load', preencherParceiros);
    }
});
