document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const btn = document.querySelector('button[type="submit"]');

    btn.textContent = "Memeriksa...";
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        const response = await fetch('https://lazy-bili-nexaproject-5f3b6277.koyeb.app/api/login', { // ⬅ ini diganti
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        if (result.success) {
            const userData = result.user || result;
            const username = userData.username || user;
            const role = userData.role || 'user';

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);

            if (role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'nexa.html';
            }
        } else {
            errorMsg.textContent = result.message || "Username atau password salah.";
            errorMsg.style.display = 'block';
            btn.textContent = "Masuk Dashboard";
            btn.disabled = false;
        }
    } catch (err) {
        errorMsg.textContent = "Gagal terhubung ke server backend.";
        errorMsg.style.display = 'block';
        btn.textContent = "Masuk Dashboard";
        btn.disabled = false;
    }
});
