/**
 * Nexa - Sistem Rekomendasi Laptop Cerdas
 * File utama untuk logika frontend aplikasi
 * @author Kelompok 4 - ITSNU Pekalongan
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // CONFIGURATION
    // =========================================
    const CONFIG = {
        SELECTORS: {
            BUDGET_SLIDER: '#budget',
            BUDGET_VALUE_DISPLAY: '#budgetValue',
            FORM_STEPS: '.form-step',
            PREV_BTN: '.prev-btn',
            NEXT_BTN: '.next-btn',
            SUBMIT_BTN: '.submit-btn',
            FORM: '#recommendationForm',
            PROGRESS_BAR_FILL: '#progressBarFill',
            PRIORITY_CARDS: '.priority-card',
            PRIORITY_INPUT: '#priority',
            BRAND_FILTERS_CONTAINER: '#brand-filters'
        },
        API_BASE_URL: 'https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api'
    };

    // =========================================
    // 1. ELEMENT INITIALIZATION
    // =========================================
    const budgetSlider = document.querySelector(CONFIG.SELECTORS.BUDGET_SLIDER);
    const budgetValueDisplay = document.querySelector(CONFIG.SELECTORS.BUDGET_VALUE_DISPLAY);
    const formSteps = document.querySelectorAll(CONFIG.SELECTORS.FORM_STEPS);
    const prevBtn = document.querySelector(CONFIG.SELECTORS.PREV_BTN);
    const nextBtn = document.querySelector(CONFIG.SELECTORS.NEXT_BTN);
    const submitBtn = document.querySelector(CONFIG.SELECTORS.SUBMIT_BTN);
    const form = document.querySelector(CONFIG.SELECTORS.FORM);
    const progressBarFill = document.querySelector(CONFIG.SELECTORS.PROGRESS_BAR_FILL);
    const priorityCards = document.querySelectorAll(CONFIG.SELECTORS.PRIORITY_CARDS);
    const priorityInput = document.querySelector(CONFIG.SELECTORS.PRIORITY_INPUT);

    let currentStep = 1;
    const totalSteps = formSteps.length;

    // =========================================
    // 2. LOGIKA SLIDER BUDGET (ANGKA RUPIAH)
    // =========================================
    /**
     * Format angka ke format Rupiah Indonesia
     * @param {number} value - Nilai angka yang akan diformat
     * @returns {string} - String angka yang sudah diformat
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    /**
     * Inisialisasi dan setup slider budget
     */
    const initializeBudgetSlider = () => {
        if (!budgetSlider || !budgetValueDisplay) {
            console.warn('Budget slider elements not found');
            return;
        }

        // Format angka saat awal dimuat
        budgetValueDisplay.textContent = formatCurrency(budgetSlider.value);

        // Update angka secara real-time saat slider digeser
        budgetSlider.addEventListener('input', function() {
            budgetValueDisplay.textContent = formatCurrency(this.value);
        });
    };

    initializeBudgetSlider();

    // =========================================
    // 3. BRAND FILTERS LOADING (FROM API)
    // =========================================
    /**
     * Load brand filters from API
     * @async
     * @returns {Promise<void>}
     */
    const loadBrandFilters = async () => {
        const brandFiltersContainer = document.querySelector(CONFIG.SELECTORS.BRAND_FILTERS_CONTAINER);

        if (!brandFiltersContainer) {
            console.warn('Brand filters container not found');
            return;
        }

        try {
            // Show loading state
            brandFiltersContainer.innerHTML = '<p class="loading">Memuat daftar merek...</p>';

            const response = await fetch(`${CONFIG.API_BASE_URL}/laptops`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000 // 5 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const laptops = await response.json();

            if (!Array.isArray(laptops)) {
                throw new Error('Invalid API response format');
            }

            const brands = [...new Set(laptops.map(laptop => laptop.brand).filter(Boolean))].sort();

            if (brands.length === 0) {
                brandFiltersContainer.innerHTML = '<p class="no-results">Tidak ada merek yang tersedia.</p>';
                return;
            }

            brandFiltersContainer.innerHTML = '';

            brands.forEach(brand => {
                const div = document.createElement('div');
                div.className = 'brand-item';
                div.innerHTML = `
                    <input type="checkbox" id="brand-${brand.toLowerCase().replace(/\s+/g, '-')}" name="brand" value="${brand}">
                    <label for="brand-${brand.toLowerCase().replace(/\s+/g, '-')}">${brand}</label>
                `;
                brandFiltersContainer.appendChild(div);
            });

        } catch (error) {
            console.error('Failed to load brand filters:', error);
            brandFiltersContainer.innerHTML = `
                <div class="error-message">
                    <p>Gagal memuat filter merek.</p>
                    <small>Pastikan server backend berjalan dan koneksi internet stabil.</small>
                </div>
            `;
        }
    };

    // Load brand filters on initialization
    loadBrandFilters();

    // =========================================
    // 3. LOGIKA FORM WIZARD (LANGKAH-DEMI-LANGKAH)
    // =========================================
    /**
     * Update tampilan langkah form
     */
    const updateFormStep = () => {
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        formSteps[currentStep - 1].classList.add('active');

        // Update Progress Bar
        if (progressBarFill) {
            progressBarFill.style.width = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;
        }

        // Update Button Visibility
        if(prevBtn) prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        if(nextBtn) nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
        if(submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
    };

    /**
     * Inisialisasi navigasi form wizard
     */
    const initializeFormWizard = () => {
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateFormStep();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateFormStep();
                }
            });
        }

        updateFormStep(); // Initial call
    };

    initializeFormWizard();

    // =========================================
    // 4. LOGIKA KARTU PRIORITAS
    // =========================================
    /**
     * Inisialisasi kartu prioritas
     */
    const initializePriorityCards = () => {
        priorityCards.forEach(card => {
            card.addEventListener('click', () => {
                priorityCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                if (priorityInput) {
                    priorityInput.value = card.getAttribute('data-value');
                }
            });
        });
    };

    initializePriorityCards();

    priorityCards.forEach(card => {
        card.addEventListener('click', () => {
            priorityCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            if (priorityInput) {
                priorityInput.value = card.getAttribute('data-value');
            }
        });
    });

    // =========================================
    // 5. LOGIKA SUBMIT FORM
    // =========================================
    /**
     * Inisialisasi submit form
     */
    const initializeFormSubmit = () => {
        if (!form) {
            console.warn('Recommendation form not found');
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const budgetInput = document.getElementById('budget');
            const majorInput = document.getElementById('major');
            const priorityInput = document.getElementById('priority');

            const budget = budgetInput ? budgetInput.value : 0;
            const major = majorInput ? majorInput.value : '';
            const priority = priorityInput ? priorityInput.value : '';

            const selectedBrands = Array.from(document.querySelectorAll('#brand-filters input:checked')).map(cb => cb.value);

            let url = `hasil.html?budget=${budget}&major=${encodeURIComponent(major)}&priority=${encodeURIComponent(priority)}`;
            if (selectedBrands.length > 0) {
                url += `&brands=${encodeURIComponent(selectedBrands.join(','))}`;
            }
            window.location.href = url;
        });
    };

    initializeFormSubmit();

    // =========================================
    // 6. LOGIKA SIDEBAR & PROFIL USER
    // =========================================
    /**
     * Inisialisasi sidebar dan profil user
     */
    const initializeSidebar = () => {
        const menuBtn = document.getElementById('menuBtn');
        const headerLoginBtn = document.getElementById('headerLoginBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        // Cek Status Login
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (isLoggedIn === 'true') {
            // Jika Login: Tampilkan Menu, Sembunyikan tombol Login
            if(menuBtn) menuBtn.style.display = 'block';
            if(headerLoginBtn) headerLoginBtn.style.display = 'none';

            // Update Info di Sidebar
            const sidebarUsername = document.getElementById('sidebarUsername');
            const sidebarRole = document.getElementById('sidebarRole');
            const avatarInitial = document.getElementById('avatarInitial');

            if (sidebarUsername) sidebarUsername.textContent = username;
            if (sidebarRole) sidebarRole.textContent = role === 'admin' ? 'Administrator' : 'Member';
            if (avatarInitial) avatarInitial.textContent = username.charAt(0).toUpperCase();

            // Jika Admin, tampilkan link dashboard
            if (role === 'admin') {
                const linkAdminSidebar = document.getElementById('linkAdminSidebar');
                if (linkAdminSidebar) linkAdminSidebar.style.display = 'block';
            }
        } else {
            // Jika Belum Login
            if(menuBtn) menuBtn.style.display = 'none';
            if(headerLoginBtn) headerLoginBtn.style.display = 'block';
        }

        // Fungsi Buka/Tutup Sidebar
        if (menuBtn && sidebar && overlay) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            });
        }

        if (overlay && sidebar) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
    };

    initializeSidebar();

    // =========================================
    // 7. FUNGSI GLOBAL
    // =========================================
    /**
     * Fungsi logout global
     */
    window.logoutUser = function() {
        if(confirm("Yakin ingin keluar?")) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    };
});
