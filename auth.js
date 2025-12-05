// auth.js - Penjaga Halaman Admin

const username = localStorage.getItem('username');
const role = localStorage.getItem('role');
const isLoggedIn = localStorage.getItem('isLoggedIn'); // optional

// Kalau belum login / tidak ada username / bukan admin -> tendang ke login
if (!username || role !== 'admin') {
    alert("Akses Ditolak! Halaman ini hanya untuk Admin.");
    window.location.href = 'login.html';
}
