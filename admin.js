// FINAL
const API_URL = 'https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api/laptops';

// 1. Load Data saat halaman dibuka
document.addEventListener('DOMContentLoaded', fetchLaptops);

async function fetchLaptops() {
    try {
        const response = await fetch(API_URL);
        const laptops = await response.json();
        const tbody = document.querySelector('#laptopTable tbody');
        
        tbody.innerHTML = ''; // Bersihkan tabel

        if (laptops.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada data laptop.</td></tr>';
            return;
        }

        laptops.forEach(laptop => {
            const tr = document.createElement('tr');
            const formattedPrice = new Intl.NumberFormat('id-ID').format(laptop.price);
            
            // PERBAIKAN PENTING: 
            // Tambahkan tanda kutip '' di sekitar ${laptop.id} pada tombol hapus
            // karena ID MongoDB berupa string.
            tr.innerHTML = `
                <td style="font-size: 0.8rem; color: #888;">${laptop.id}</td>
                <td><strong>${laptop.name}</strong></td>
                <td>Rp ${formattedPrice}</td>
                <td>${laptop.brand}</td>
                <td>
                    <button class="btn-delete" onclick="deleteLaptop('${laptop.id}')">Hapus</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Gagal memuat data:", error);
        alert("Gagal terhubung ke server backend.");
    }
}

// 2. Fungsi Menambah Laptop
const form = document.getElementById('addLaptopForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ambil data dari form
        const fiturInput = document.getElementById('fitur');
        const newLaptop = {
            // pakai id input yang baru
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

            // fitur dibersihkan dulu (hapus spasi & kosong)
            fitur: fiturInput.value
            .split(',')
            .map(f => f.trim())
            .filter(f => f.length > 0)
        };


        // Kirim ke Server (POST)
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLaptop)
            });

            if (response.ok) {
                alert('Berhasil menambah laptop!');
                form.reset();
                toggleForm();
                fetchLaptops(); // Refresh tabel otomatis
            } else {
                alert('Gagal menambah data.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan server.');
        }
    });
}

// 3. Fungsi Menghapus Laptop
async function deleteLaptop(id) {
    if (confirm('Yakin ingin menghapus laptop ini?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchLaptops(); // Refresh tabel
            } else {
                alert('Gagal menghapus data.');
            }
        } catch (error) {
            console.error(error);
            alert('Error saat menghapus.');
        }
    }
}

// 4. Helper: Buka/Tutup Form
function toggleForm() {
    const formContainer = document.getElementById('addFormContainer');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

// 5. Fungsi Logout (Baru)
function logout() {
    if(confirm("Apakah Anda yakin ingin keluar?")) {
        // Hapus semua data sesi login
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('isAdminLoggedIn'); // Jaga-jaga jika masih pakai key lama
        
        // Kembalikan ke halaman login
        window.location.href = 'login.html';
    }
}