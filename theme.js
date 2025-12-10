document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // 1. Cek tema yang tersimpan di memori browser
    const savedTheme = localStorage.getItem('laptofy-theme');
    
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        if(toggleBtn) toggleBtn.textContent = '🌙'; // Ikon Bulan
    } else {
        htmlElement.setAttribute('data-theme', 'light'); // Default
        if(toggleBtn) toggleBtn.textContent = '☀️'; // Ikon Matahari
    }

    // 2. Event listener saat tombol ditekan
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                // Pindah ke Light
                htmlElement.setAttribute('data-theme', 'light');
                toggleBtn.textContent = '☀️';
                localStorage.setItem('laptofy-theme', 'light');
            } else {
                // Pindah ke Dark
                htmlElement.setAttribute('data-theme', 'dark');
                toggleBtn.textContent = '🌙';
                localStorage.setItem('laptofy-theme', 'dark');
            }
        });
    }
});