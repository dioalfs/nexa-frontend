// hasil.js – Expert System Laptofy (Supabase version, FULL RULE)
// =============================================================

import { supabase } from './supabase.js';

window.addEventListener('DOMContentLoaded', () => {
    runExpertSystem();
});

async function runExpertSystem() {
    const resultsContainer = document.getElementById('results');
    const params = new URLSearchParams(window.location.search);

    const budget = parseInt(params.get('budget'));
    const major = params.get('major');
    const priority = params.get('priority');
    const selectedBrandsParam = params.get('brands');

    if (!budget || !major || !priority) {
        resultsContainer.innerHTML =
            '<p class="no-results">Kriteria tidak lengkap. Silakan kembali.</p>';
        return;
    }

    try {
        // ======================================
        // 1. AMBIL DATA DARI SUPABASE
        // ======================================
        const { data: laptopDatabase, error } = await supabase
            .from('laptops')
            .select('*');

        if (error) throw error;

        // ======================================
        // 2. FILTER ANGGARAN
        // ======================================
        let filteredLaptops = laptopDatabase.filter(
            (laptop) => laptop.price <= budget
        );

        // ======================================
        // 3. FILTER BRAND (OPSIONAL)
        // ======================================
        if (selectedBrandsParam) {
            const selectedBrands = selectedBrandsParam.split(',');
            filteredLaptops = filteredLaptops.filter((laptop) =>
                selectedBrands.includes(laptop.brand)
            );
        }

        // ======================================
        // 4. PROSES SKOR (FORWARD CHAINING)
        // ======================================
        const scoredLaptops = filteredLaptops.map((laptop) => {
            let score = 0;
            let reasons = [];

            const storage = (laptop.storage || '').toLowerCase();
            const cpu = (laptop.cpu || '').toLowerCase();
            const gpu = (laptop.gpu || '').toLowerCase();
            const screen = (laptop.screen || '').toLowerCase();

            // Supabase: features (JSONB)
            const fiturArr = Array.isArray(laptop.features)
                ? laptop.features
                : laptop.features
                ? [laptop.features]
                : [];

            // ========= BASE SCORE =========

            // RAM
            if (laptop.ram >= 16) {
                score += 25;
                reasons.push('RAM 16GB atau lebih, sangat nyaman untuk multitasking.');
            } else if (laptop.ram >= 8) {
                score += 15;
                reasons.push('RAM 8GB, cukup untuk pemakaian harian dan kuliah.');
            } else if (laptop.ram >= 4) {
                score += 5;
                reasons.push('RAM 4GB, masih cukup untuk tugas ringan.');
            }

            // Storage
            if (storage.includes('ssd')) {
                score += 15;
                reasons.push('Menggunakan SSD, performa sistem lebih cepat.');
                if (storage.includes('nvme')) {
                    score += 5;
                    reasons.push('SSD NVMe, kecepatan baca tulis sangat tinggi.');
                }
            } else if (storage) {
                score += 3;
                reasons.push('Masih HDD, performa standar.');
            }

            // CPU
            if (cpu.includes('i9') || cpu.includes('ryzen 9')) {
                score += 25;
                reasons.push('CPU kelas flagship untuk tugas berat.');
            } else if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                score += 20;
                reasons.push('CPU performa tinggi, cocok untuk desain & komputasi berat.');
            } else if (cpu.includes('i5') || cpu.includes('ryzen 5')) {
                score += 12;
                reasons.push('CPU kelas menengah yang seimbang.');
            } else if (
                cpu.includes('i3') ||
                cpu.includes('ryzen 3') ||
                cpu.includes('celeron')
            ) {
                score += 6;
                reasons.push('CPU entry-level untuk kebutuhan ringan.');
            }

            // GPU
            if (gpu.includes('rtx') || gpu.includes('gtx') || gpu.includes('radeon')) {
                score += 18;
                reasons.push('GPU dedicated mendukung desain dan rendering.');
            } else if (gpu) {
                score += 5;
                reasons.push('GPU terintegrasi untuk penggunaan harian.');
            }

            // Baterai
            if (laptop.battery >= 10) {
                score += 15;
                reasons.push('Baterai sangat awet untuk aktivitas seharian.');
            } else if (laptop.battery >= 7) {
                score += 10;
                reasons.push('Baterai cukup awet untuk kuliah.');
            } else if (laptop.battery >= 5) {
                score += 5;
                reasons.push('Baterai standar.');
            }

            // Berat
            if (laptop.weight <= 1.3) {
                score += 12;
                reasons.push('Bobot sangat ringan dan portable.');
            } else if (laptop.weight <= 1.7) {
                score += 7;
                reasons.push('Bobot masih nyaman dibawa.');
            }

            // ========= ATURAN JURUSAN =========

            if (major === 'Umum') {
                if (laptop.weight <= 1.5) {
                    score += 8;
                    reasons.push('Ringan, cocok untuk aktivitas harian.');
                }
                if (laptop.battery >= 8) {
                    score += 8;
                    reasons.push('Baterai awet untuk mobilitas.');
                }
            }

            if (major === 'Teknik/Desain') {
                if (gpu.includes('rtx') || gpu.includes('gtx') || gpu.includes('radeon')) {
                    score += 12;
                    reasons.push('GPU mendukung software desain & render.');
                }
                if (laptop.ram >= 16) {
                    score += 8;
                    reasons.push('RAM besar untuk multitasking berat.');
                }
                if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                    score += 6;
                    reasons.push('CPU kuat untuk komputasi dan rendering.');
                }
            }

            // ========= PRIORITAS USER =========

            if (priority === 'portabilitas') {
                if (laptop.weight <= 1.4) {
                    score += 10;
                    reasons.push('Sangat portable.');
                }
                if (laptop.battery >= 8) {
                    score += 6;
                    reasons.push('Baterai mendukung mobilitas tinggi.');
                }
            }

            if (priority === 'performa') {
                if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                    score += 10;
                    reasons.push('Performa prosesor tinggi.');
                }
                if (laptop.ram >= 16) {
                    score += 8;
                    reasons.push('RAM besar untuk software berat.');
                }
                if (!gpu.includes('integrated') && gpu) {
                    score += 6;
                    reasons.push('GPU dedicated meningkatkan performa grafis.');
                }
            }

            if (priority === 'layar') {
                if (screen.includes('oled') || screen.includes('amoled')) {
                    score += 10;
                    reasons.push('Layar OLED dengan kualitas warna unggul.');
                } else if (screen.includes('ips') || screen.includes('144hz')) {
                    score += 7;
                    reasons.push('Panel layar berkualitas tinggi.');
                }
            }

            // ========= ATURAN KHUSUS =========

            if (fiturArr.includes('ChromeOS')) {
                if (major === 'Umum' || priority === 'portabilitas') {
                    score += 20;
                    reasons.push('ChromeOS ringan dan efisien.');
                } else {
                    score -= 10;
                    reasons.push('ChromeOS kurang cocok untuk software khusus.');
                }
            }

            if (fiturArr.includes('macOS')) {
                if (
                    major === 'Teknik/Desain' ||
                    priority === 'portabilitas' ||
                    priority === 'layar'
                ) {
                    score += 25;
                    reasons.push('macOS dengan ekosistem premium.');
                }
            }

            if (budget <= 5000000) {
                if (storage.includes('ssd')) {
                    score += 8;
                    reasons.push('SSD di harga terjangkau adalah nilai plus.');
                }
                if (laptop.ram >= 8) {
                    score += 6;
                    reasons.push('RAM 8GB cukup future-proof.');
                }
            }

            if (score === 0) {
                score = 10;
                reasons.push('Spesifikasi dasar yang cukup.');
            }

            return { ...laptop, score, reasons };
        });

        // ======================================
        // 5. SORT & TAMPILKAN
        // ======================================
        scoredLaptops.sort((a, b) => b.score - a.score);
        displayResults(scoredLaptops);

    } catch (err) {
        console.error(err);
        resultsContainer.innerHTML =
            '<p class="no-results">Gagal memproses rekomendasi.</p>';
    }
}

// ======================================
// 6. TAMPILKAN HASIL
// ======================================
function displayResults(laptops) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (!laptops || laptops.length === 0) {
        resultsContainer.innerHTML =
            '<p class="no-results">Tidak ada laptop yang sesuai.</p>';
        return;
    }

    const summaryEl = document.getElementById('result-summary');
    if (summaryEl) {
        summaryEl.textContent =
            `Ditemukan ${laptops.length} laptop. Berikut 5 terbaik:`;
    }

    laptops.slice(0, 5).forEach((laptop) => {
        const price = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(laptop.price);

        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <h3>${laptop.name}</h3>
            <p><strong>${laptop.brand}</strong></p>
            <p>Harga: ${price}</p>
            <p>CPU: ${laptop.cpu} | RAM: ${laptop.ram}GB | GPU: ${laptop.gpu}</p>
            <ul>${laptop.reasons.map(r => `<li>${r}</li>`).join('')}</ul>
            <div class="score-box">Skor: ${laptop.score}</div>
        `;

        resultsContainer.appendChild(card);
    });
}
