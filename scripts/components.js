(function () {
    /* ── Partials (header / footer) ───────────────────────────── */
    async function inject(id, path) {
        const el = document.getElementById(id);
        if (!el) return;
        try {
            const res = await fetch(path);
            if (res.ok) el.outerHTML = await res.text();
        } catch (_) {}
    }

    inject('site-header', 'partials/header.html');
    inject('site-footer', 'partials/footer.html');

    /* ── Analytics (GA4) ──────────────────────────────────────── */
    // Para ativar a medição, cole o ID do GA4 abaixo (ex.: 'G-XXXXXXXXXX').
    // Enquanto vazio, nada é carregado e trackEvent é um no-op seguro.
    var GA_ID = '';
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    if (GA_ID) {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        gtag('js', new Date());
        gtag('config', GA_ID);
    }
    window.trackEvent = function (name, params) {
        try { gtag('event', name, params || {}); } catch (_) {}
    };

    /* ── Botão flutuante de WhatsApp ──────────────────────────── */
    function injectWhatsAppFloat() {
        if (document.querySelector('.whatsapp-float')) return;
        var a = document.createElement('a');
        a.className = 'whatsapp-float';
        a.href = 'https://wa.me/5567992641136?text=' +
            encodeURIComponent('Olá, vim pelo site da UP e gostaria de falar com a equipe.');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', 'Falar no WhatsApp');
        a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
        document.body.appendChild(a);
    }
    if (document.body) injectWhatsAppFloat();
    else document.addEventListener('DOMContentLoaded', injectWhatsAppFloat);

    /* ── Tracking de cliques (CTA / WhatsApp) ─────────────────── */
    document.addEventListener('click', function (e) {
        var t = e.target.closest && e.target.closest('a, button');
        if (!t) return;
        if (t.classList.contains('whatsapp-float') || t.classList.contains('cta-button-whatsapp')) {
            window.trackEvent('whatsapp_click');
        } else if (t.classList.contains('cta-button')) {
            window.trackEvent('cta_click', { texto: (t.textContent || '').trim().slice(0, 60) });
        }
    });
})();
