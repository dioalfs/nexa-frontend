// admin.js — FINAL Supabase Version
// =================================
import { supabase } from './supabase.js';
import { requireAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    await requireAuth(true); // true = admin only
    fetchLaptops();
});

// =================================
// 1. LOAD DATA LAPTOP
// =================================
async function fetchLaptops() {
    try {
        const { data: laptops, error } = await supabase
            .from('laptops')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('#laptopTable tbody');
        tbody.innerHTML = '';

        if (!laptops || laptops.length === 0) {
            tbody.innerHTML =
                '<tr><td colspan="5" style="text-align:center;">Belum ada data laptop.</td></tr>';
            return;
        }

        laptops.forEach((laptop) => {
            const tr = document.createElement('tr');
            const formattedPrice = new Intl.NumberFormat('id-ID').format(laptop.price);

            tr.innerHTML = `
                <td style="font-size:0.75rem;color:#888">${laptop.id}</td>
                <td><strong>${laptop.name}</strong></td>
                <td>Rp ${formattedPrice}</td>
                <td>${laptop.brand}</td>
                <td>
                    <button class="btn-delete" data-id="${laptop.id}">Hapus</button>
                </td>
            `;

            tr.querySelector('.btn-delete')
                .addEventListener('click', () => deleteLaptop(laptop.id));

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        alert('Gagal memuat data laptop.');
    }
}

// =================================
// 2. TAMBAH LAPTOP
// =================================
const form = document.getElementById('addLaptopForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fiturInput = document.getElementById('fitur');

        const newLaptop = {
            name: document.getElementById('namaLaptop').value.trim(),
            brand: document.getElementById('brand').value.trim(),
            price: Number(document.getElementById('harga').value),
            cpu: document.getElementById('cpu').value.trim(),
            ram: Number(document.getElementById('ram').value),
            storage: document.getElementById('storage').value.trim(),
            gpu: document.getElementById('gpu').value.trim(),
            weight: Number(document.getElementById('berat').value),
            battery: Number(document.getElementById('baterai').value),
            screen: document.getElementById('layar').value.trim(),
            features: fiturInput.value
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)
        };

        try {
            const { error } = await supabase
                .from('laptops')
                .insert([newLaptop]);

            if (error) throw error;

            alert('Laptop berhasil ditambahkan.');
            form.reset();
            toggleForm();
            fetchLaptops();

        } catch (err) {
            console.error(err);
            alert('Gagal menambah laptop.');
        }
    });
}

// =================================
// 3. HAPUS LAPTOP
// =================================
async function deleteLaptop(id) {
    if (!confirm('Yakin ingin menghapus laptop ini?')) return;

    try {
        const { error } = await supabase
            .from('laptops')
            .delete()
            .eq('id', id);

        if (error) throw error;

        fetchLaptops();

    } catch (err) {
        console.error(err);
        alert('Gagal menghapus data.');
    }
}

// =================================
// 4. TOGGLE FORM
// =================================
function toggleForm() {
    const formContainer = document.getElementById('addFormContainer');
    formContainer.style.display =
        formContainer.style.display === 'block' ? 'none' : 'block';
}

// =================================
// 5. LOGOUT (SUPABASE)
// =================================
async function logout() {
    if (!confirm('Apakah Anda yakin ingin keluar?')) return;

    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// agar bisa dipanggil dari HTML
window.logout = logout;
window.toggleForm = toggleForm;

import { requireAdmin } from './auth.js';

await requireAdmin(); // ⛔ BLOK SEBELUM APA PUN JALAN
