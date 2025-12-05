// nexa.js
const API_URL = 'https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api/laptops';

document.addEventListener('DOMContentLoaded', () => {
    // ELEMENT FORM & STEP
    const form = document.getElementById('recommendationForm');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressBarFill = document.getElementById('progressBarFill');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');

    let currentStep = 0; // index 0..3

    function updateStepUI() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStep);
        });

        const percent = ((currentStep + 1) / steps.length) * 100;
        progressBarFill.style.width = `${percent}%`;

        // tombol
        if (currentStep === 0) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        } else if (currentStep === steps.length - 1) {
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    // SLIDER BUDGET
    const budgetInput = document.getElementById('budget');
    const budgetDisplay = document.getElementById('budgetDisplay');
    function formatRupiah(num) {
        return new Intl.NumberFormat('id-ID').format(num);
    }
    if (budgetInput && budgetDisplay) {
        budgetDisplay.textContent = 'Rp ' + formatRupiah(budgetInput.value);
        budgetInput.addEventListener('input', () => {
            budgetDisplay.textContent = 'Rp ' + formatRupiah(budgetInput.value);
        });
    }

    // PRIORITY KARTU
    const priorityHidden = document.getElementById('priority');
    const priorityCards = document.querySelectorAll('.priority-card');
    priorityCards.forEach(card => {
        card.addEventListener('click', () => {
            priorityCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            priorityHidden.value = card.getAttribute('data-value');
        });
    });

    // LOAD BRAND dari API (opsional)
    const brandContainer = document.getElementById('brand-filters');
    async function loadBrands() {
        if (!brandContainer) return;
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            const brands = [...new Set(data.map(l => l.brand))].sort();
            if (!brands.length) {
                brandContainer.innerHTML = '<p class="placeholder">Belum ada data merek di database.</p>';
                return;
            }
            brandContainer.innerHTML = '';
            brands.forEach(brand => {
                const id = 'brand-' + brand.replace(/\s+/g, '-').toLowerCase();
                const div = document.createElement('div');
                div.className = 'brand-item';
                div.innerHTML = `
                    <input type="checkbox" id="${id}" value="${brand}">
                    <label for="${id}">${brand}</label>
                `;
                brandContainer.appendChild(div);
            });
        } catch (err) {
            console.error('Gagal memuat brand:', err);
            brandContainer.innerHTML = '<p class="placeholder">Gagal memuat merek dari server.</p>';
        }
    }
    loadBrands();

    // NAVIGASI NEXT/PREV
    nextBtn.addEventListener('click', () => {
        if (currentStep === 1) {
            const major = document.getElementById('major').value;
            if (!major) {
                alert('Pilih dulu kelompok jurusanmu.');
                return;
            }
        }
        if (currentStep === 2) {
            if (!priorityHidden.value) {
                alert('Pilih dulu prioritas utamamu.');
                return;
            }
        }
        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStepUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepUI();
        }
    });

    updateStepUI(); // init

    // SUBMIT FORM -> arahkan ke hasil.html
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const budget = parseInt(budgetInput.value);
        const major = document.getElementById('major').value;
        const priority = priorityHidden.value;

        const brandChecks = document.querySelectorAll('#brand-filters input[type="checkbox"]:checked');
        const brands = Array.from(brandChecks).map(b => b.value);

        const params = new URLSearchParams();
        params.set('budget', budget);
        params.set('major', major);
        params.set('priority', priority);
        if (brands.length) params.set('brands', brands.join(','));

        window.location.href = 'hasil.html?' + params.toString();
    });
});
