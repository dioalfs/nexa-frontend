// laptofy.js
import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {

    /* =========================
       ELEMENT FORM & STEP
    ========================= */
    const form = document.getElementById('recommendationForm');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressBarFill = document.getElementById('progressBarFill');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');

    let currentStep = 0;

    function updateStepUI() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStep);
        });

        progressBarFill.style.width =
            `${((currentStep + 1) / steps.length) * 100}%`;

        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        nextBtn.style.display =
            currentStep === steps.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display =
            currentStep === steps.length - 1 ? 'inline-block' : 'none';
    }

    /* =========================
       SLIDER BUDGET
    ========================= */
    const budgetInput = document.getElementById('budget');
    const budgetDisplay = document.getElementById('budgetDisplay');

    const formatRupiah = num =>
        new Intl.NumberFormat('id-ID').format(num);

    if (budgetInput && budgetDisplay) {
        budgetDisplay.textContent = 'Rp ' + formatRupiah(budgetInput.value);
        budgetInput.addEventListener('input', () => {
            budgetDisplay.textContent =
                'Rp ' + formatRupiah(budgetInput.value);
        });
    }

    /* =========================
       PRIORITY CARD
    ========================= */
    const priorityHidden = document.getElementById('priority');
    const priorityCards = document.querySelectorAll('.priority-card');

    priorityCards.forEach(card => {
        card.addEventListener('click', () => {
            priorityCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            priorityHidden.value = card.dataset.value;
        });
    });

    /* =========================
       LOAD BRAND DARI SUPABASE
    ========================= */
    const brandContainer = document.getElementById('brand-filters');

    const { data: laptops, error } = await supabase
        .from('laptops')
        .select('*');

    console.log('Laptop data:', laptops, error);

    if (!brandContainer || error) return;

    const brands = [...new Set(laptops.map(l => l.brand))].sort();

    brandContainer.innerHTML = brands.length
        ? ''
        : '<p class="placeholder">Belum ada data merek.</p>';

    brands.forEach(brand => {
        const id = 'brand-' + brand.toLowerCase().replace(/\s+/g, '-');
        brandContainer.innerHTML += `
            <div class="brand-item">
                <input type="checkbox" id="${id}" value="${brand}">
                <label for="${id}">${brand}</label>
            </div>
        `;
    });

    /* =========================
       NAVIGASI STEP
    ========================= */
    nextBtn.addEventListener('click', () => {
        if (currentStep === 1 && !document.getElementById('major').value) {
            alert('Pilih dulu kelompok jurusanmu.');
            return;
        }
        if (currentStep === 2 && !priorityHidden.value) {
            alert('Pilih dulu prioritas utamamu.');
            return;
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

    updateStepUI();

    /* =========================
       SUBMIT → HASIL
    ========================= */
    form.addEventListener('submit', e => {
        e.preventDefault();

        const params = new URLSearchParams({
            budget: budgetInput.value,
            major: document.getElementById('major').value,
            priority: priorityHidden.value
        });

        const brandsSelected = [...document.querySelectorAll(
            '#brand-filters input:checked'
        )].map(b => b.value);

        if (brandsSelected.length)
            params.set('brands', brandsSelected.join(','));

        window.location.href = 'hasil.html?' + params.toString();
    });
});

import { requireAuth } from './auth.js';
import { supabase } from './supabase.js';

await requireAuth(); // ⛔ BLOK TOTAL JIKA BELUM LOGIN
