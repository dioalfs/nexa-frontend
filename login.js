import { supabase } from './supabase.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    const btn = document.querySelector('button[type="submit"]');

    btn.textContent = "Memeriksa...";
    btn.disabled = true;
    errorMsg.style.display = 'none';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        const userId = data.user.id;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (profileError) throw profileError;

        const role = profile?.role || 'user';

        // REDIRECT SAJA — TANPA localStorage
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'laptofy.html';
        }

    } catch (err) {
        console.error(err);
        errorMsg.textContent = err.message || "Login gagal.";
        errorMsg.style.display = 'block';
        btn.textContent = "Masuk Dashboard";
        btn.disabled = false;
    }
});
