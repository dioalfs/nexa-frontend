// hasil.js – Expert System Nexa (versi dengan aturan skor lebih lengkap)

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
        const response = await fetch('https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api/laptops');
        const laptopDatabase = await response.json();

        // =========================
        // 1. FILTER ANGGARAN
        // =========================
        let filteredLaptops = laptopDatabase.filter(
            (laptop) => laptop.price <= budget
        );

        // =========================
        // 2. FILTER BRAND (opsional)
        // =========================
        if (selectedBrandsParam) {
            const selectedBrands = selectedBrandsParam.split(',');
            filteredLaptops = filteredLaptops.filter((laptop) =>
                selectedBrands.includes(laptop.brand)
            );
        }

        // =========================
        // 3. PROSES SKORING
        // =========================
        const scoredLaptops = filteredLaptops.map((laptop) => {
            let score = 0;
            let reasons = [];

            // Siapkan string lower-case & fitur array agar aman
            const storage = (laptop.storage || '').toLowerCase();
            const cpu = (laptop.cpu || '').toLowerCase();
            const gpu = (laptop.gpu || '').toLowerCase();
            const screen = (laptop.screen || '').toLowerCase();
            const fiturArr = Array.isArray(laptop.fitur)
                ? laptop.fitur
                : laptop.fitur
                ? [laptop.fitur]
                : [];

            // =========== 3.1 BASE SCORE DARI SPEK UMUM ===========

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
                reasons.push('Sudah menggunakan SSD, performa baca tulis lebih cepat.');
                if (storage.includes('nvme')) {
                    score += 5;
                    reasons.push('SSD NVMe, kecepatan I/O sangat tinggi.');
                }
            } else if (storage) {
                score += 3;
                reasons.push('Masih HDD, performanya standar.');
            }

            // CPU
            if (cpu.includes('i9') || cpu.includes('ryzen 9')) {
                score += 25;
                reasons.push('CPU kelas flagship, sangat kuat untuk tugas berat.');
            } else if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                score += 20;
                reasons.push('CPU performa tinggi, cocok untuk desain & komputasi berat.');
            } else if (cpu.includes('i5') || cpu.includes('ryzen 5')) {
                score += 12;
                reasons.push('CPU kelas menengah, seimbang performa & efisiensi.');
            } else if (cpu.includes('i3') || cpu.includes('ryzen 3') || cpu.includes('celeron')) {
                score += 6;
                reasons.push('CPU entry-level, cukup untuk tugas ringan dan browsing.');
            }

            // GPU
            if (gpu.includes('rtx') || gpu.includes('gtx') || gpu.includes('radeon')) {
                score += 18;
                reasons.push('GPU dedicated, kuat untuk desain, render, dan game.');
            } else if (gpu.includes('integrated') || gpu) {
                score += 5;
                reasons.push('GPU terintegrasi, cukup untuk pemakaian sehari-hari.');
            }

            // Baterai (dalam jam)
            if (laptop.battery >= 10) {
                score += 15;
                reasons.push('Baterai sangat awet, cocok untuk aktivitas seharian.');
            } else if (laptop.battery >= 7) {
                score += 10;
                reasons.push('Baterai cukup awet untuk kuliah atau kerja.');
            } else if (laptop.battery >= 5) {
                score += 5;
                reasons.push('Baterai standar, mungkin perlu sering charge.');
            }

            // Berat (kg)
            if (laptop.weight <= 1.3) {
                score += 12;
                reasons.push('Bobot sangat ringan, enak dibawa ke kampus.');
            } else if (laptop.weight <= 1.7) {
                score += 7;
                reasons.push('Bobot masih cukup nyaman untuk mobilitas.');
            }

            // =========== 3.2 BONUS BERDASARKAN JURUSAN ===========

            if (major === 'Umum') {
                if (laptop.weight <= 1.5) {
                    score += 8;
                    reasons.push('Ringan, praktis untuk dibawa setiap hari.');
                }
                if (laptop.battery >= 8) {
                    score += 8;
                    reasons.push('Baterai tahan lama, pas untuk aktivitas seharian.');
                }
            }

            if (major === 'Teknik/Desain') {
                if (gpu.includes('rtx') || gpu.includes('gtx') || gpu.includes('radeon')) {
                    score += 12;
                    reasons.push('GPU mendukung software desain dan render 3D.');
                }
                if (laptop.ram >= 16) {
                    score += 8;
                    reasons.push('RAM besar membantu saat membuka banyak aplikasi desain.');
                }
                if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                    score += 6;
                    reasons.push('Prosesor kuat, lebih cepat saat compile & render.');
                }
            }

            // =========== 3.3 BONUS BERDASARKAN PRIORITAS ===========

            if (priority === 'portabilitas') {
                if (laptop.weight <= 1.4) {
                    score += 10;
                    reasons.push('Sangat portable untuk dibawa ke mana-mana.');
                }
                if (laptop.battery >= 8) {
                    score += 6;
                    reasons.push('Baterai mendukung mobilitas tinggi tanpa sering charge.');
                }
            }

            if (priority === 'performa') {
                if (cpu.includes('i7') || cpu.includes('ryzen 7') || cpu.includes('-h')) {
                    score += 10;
                    reasons.push('CPU kencang untuk performa maksimal.');
                }
                if (laptop.ram >= 16) {
                    score += 8;
                    reasons.push('RAM besar menunjang multitasking dan software berat.');
                }
                if (!gpu.includes('integrated') && gpu) {
                    score += 6;
                    reasons.push('GPU dedicated menambah kemampuan grafis.');
                }
            }

            if (priority === 'layar') {
                if (screen.includes('oled') || screen.includes('amoled')) {
                    score += 10;
                    reasons.push('Layar OLED, kualitas warna dan kontras sangat bagus.');
                } else if (screen.includes('ips') || screen.includes('144hz')) {
                    score += 7;
                    reasons.push('Panel layar berkualitas, nyaman untuk dilihat lama.');
                }
            }

            // =========== 3.4 ATURAN KHUSUS (ChromeOS / macOS / budget rendah) ===========

            // ChromeOS
            if (fiturArr.includes('ChromeOS')) {
                if (major === 'Umum' || priority === 'portabilitas') {
                    score += 20;
                    reasons.push('ChromeOS ringan dan efisien untuk penggunaan harian.');
                } else {
                    score -= 10; // jangan terlalu dihukum
                    reasons.push('ChromeOS kurang ideal untuk beberapa software spesifik.');
                }
            }

            // macOS
            if (fiturArr.includes('macOS')) {
                if (
                    major === 'Teknik/Desain' ||
                    priority === 'portabilitas' ||
                    priority === 'layar'
                ) {
                    score += 25;
                    reasons.push('macOS dengan ekosistem dan build quality premium.');
                }
            }

            // Bonus kecil untuk laptop murah tapi spek ok
            if (budget <= 5000000) {
                if (storage.includes('ssd')) {
                    score += 8;
                    reasons.push('Untuk kelas harga ini, SSD adalah nilai plus besar.');
                }
                if (laptop.ram >= 8) {
                    score += 6;
                    reasons.push('RAM 8GB di harga terjangkau, cukup future-proof.');
                }
            }

            // Kalau entah kenapa skornya 0, kasih base minimal
            if (score === 0) {
                score = 10;
                reasons.push('Spesifikasi dasar yang cukup untuk penggunaan ringan.');
            }

            return { ...laptop, score, reasons };
        });

        // Urutkan dari skor tertinggi
        const sortedLaptops = scoredLaptops.sort((a, b) => b.score - a.score);

        displayResults(sortedLaptops);
    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `
            <p class="no-results">
                Gagal terhubung ke API server. Pastikan server backend berjalan.
            </p>`;
    }
}

// ======================================
// 4. TAMPILKAN HASIL + ANIMASI SKOR
// ======================================
function displayResults(laptops) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (!laptops || laptops.length === 0) {
        resultsContainer.innerHTML = `
            <p class="no-results">
                Maaf, tidak ada laptop yang sesuai dengan kriteria Anda. 
                Coba ubah filter atau naikkan anggaran.
            </p>`;
        return;
    }

    const summaryEl = document.getElementById('result-summary');
    if (summaryEl) {
        summaryEl.textContent =
            `Berdasarkan kriteriamu, ditemukan ${laptops.length} laptop yang cocok. ` +
            `Berikut 5 pilihan teratas:`;
    }

    // Ambil 5 teratas
    laptops.slice(0, 5).forEach((laptop) => {
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(laptop.price);

        const reasonsHTML =
            laptop.reasons && laptop.reasons.length > 0
                ? `<ul>${laptop.reasons.map((r) => `<li>${r}</li>`).join('')}</ul>`
                : '';

        const card = document.createElement('div');
        card.className = 'result-card';

        card.innerHTML = `
            <div class="result-card-top">
                <div class="result-card-title">${laptop.name}</div>
                <div class="result-card-sub">${laptop.brand}</div>
            </div>

            <div class="result-card-info">
                <div><strong>Harga:</strong> ${formattedPrice}</div>
                <div><strong>CPU:</strong> ${laptop.cpu}</div>
                <div><strong>RAM:</strong> ${laptop.ram} GB</div>
                <div><strong>GPU:</strong> ${laptop.gpu}</div>
            </div>

            ${
                reasonsHTML
                    ? `
            <div class="result-card-reasons">
                <div class="reasons-title">Mengapa ini cocok?</div>
                ${reasonsHTML}
            </div>`
                    : ''
            }

            <div class="score-box" data-score="${laptop.score}">Skor: 0</div>
        `;

        resultsContainer.appendChild(card);
    });

    // ANIMASI SKOR
    const scoreElements = document.querySelectorAll('.score-box');
    scoreElements.forEach((el) => {
        const finalScore = parseInt(el.getAttribute('data-score'), 10) || 0;
        let currentScore = 0;
        const increment = Math.max(1, Math.ceil(finalScore / 50));

        const interval = setInterval(() => {
            currentScore += increment;
            if (currentScore >= finalScore) {
                currentScore = finalScore;
                clearInterval(interval);
            }
            el.textContent = `Skor: ${currentScore}`;
        }, 20);
    });
}
