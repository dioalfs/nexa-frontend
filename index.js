
document.addEventListener('DOMContentLoaded', function () {
    const openModal = (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    };

    const closeModal = (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    };

    // tombol di footer
    document.getElementById('btnPrivacy')?.addEventListener('click', () => {
        openModal('modalPrivacy');
    });

    document.getElementById('btnAbout')?.addEventListener('click', () => {
        openModal('modalAbout');
    });

    // tombol X
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.closeModal);
        });
    });

    // klik area gelap untuk menutup
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // ESC untuk menutup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
                overlay.classList.remove('active');
            });
        }
    });
});
