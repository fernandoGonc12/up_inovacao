(function () {
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
})();
