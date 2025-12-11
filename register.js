// register.js

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('regUsername').value;
    const pass = document.getElementById('regPassword').value;
    const msg = document.getElementById('msg');
    const btn = document.querySelector('button[type="submit"]');

    // Efek Loading
    btn.textContent = "Mendaftarkan...";
    btn.disabled = true;
    msg.style.display = 'none';

    try {
        const response = await fetch('https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        msg.textContent = result.message;
        msg.style.display = 'block';
        
        if (result.success) {
            msg.style.color = '#28a745'; // Hijau
            setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
            msg.style.color = '#dc3545'; // Merah
            btn.textContent = "Daftar Sekarang";
            btn.disabled = false;
        }
    } catch (err) {
        msg.textContent = "Gagal terhubung ke server.";
        msg.style.color = '#dc3545';
        msg.style.display = 'block';
        btn.textContent = "Daftar Sekarang";
        btn.disabled = false;
    }
});
