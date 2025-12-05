/**
 * Sidebar Management System
 * Handles sidebar toggle, user authentication display, and navigation
 * @author Kelompok 4 - ITSNU Pekalongan
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // CONFIGURATION
    // =========================================
    const CONFIG = {
        SELECTORS: {
            MENU_BTN: '#menuBtn',
            SIDEBAR: '#sidebar',
            OVERLAY: '#overlay',
            NAV_AUTH_SECTION: '#navAuthSection',
            SIDEBAR_USERNAME: '#sidebarUsername',
            SIDEBAR_ROLE: '#sidebarRole',
            AVATAR_INITIAL: '#avatarInitial',
            LINK_ADMIN: '#linkAdminSidebar',
            PROFILE_POPUP: '#profilePopup'
        },
        CLASSES: {
            EXPANDED: 'expanded',
            SIDEBAR_OPEN: 'sidebar-open',
            ACTIVE: 'active',
            D_NONE: 'd-none'
        },
        BREAKPOINTS: {
            MOBILE: 768
        },
        STORAGE_KEYS: {
            IS_LOGGED_IN: 'isLoggedIn',
            USERNAME: 'username',
            ROLE: 'role'
        }
    };

    // =========================================
    // ELEMENT INITIALIZATION
    // =========================================
    const menuBtn = document.querySelector(CONFIG.SELECTORS.MENU_BTN);
    const sidebar = document.querySelector(CONFIG.SELECTORS.SIDEBAR);
    const overlay = document.querySelector(CONFIG.SELECTORS.OVERLAY);
    const body = document.body;

    const navAuthSection = document.querySelector(CONFIG.SELECTORS.NAV_AUTH_SECTION);
    const sidebarUsername = document.querySelector(CONFIG.SELECTORS.SIDEBAR_USERNAME);
    const sidebarRole = document.querySelector(CONFIG.SELECTORS.SIDEBAR_ROLE);
    const avatarInitial = document.querySelector(CONFIG.SELECTORS.AVATAR_INITIAL);
    const linkAdmin = document.querySelector(CONFIG.SELECTORS.LINK_ADMIN);


    // =========================================
    // SIDEBAR TOGGLE FUNCTIONALITY
    // =========================================
    /**
     * Toggle sidebar visibility
     */
    const toggleSidebar = () => {
        if (!sidebar) {
            console.warn('Sidebar element not found');
            return;
        }

        const isExpanded = sidebar.classList.contains(CONFIG.CLASSES.EXPANDED);

        // Toggle sidebar expanded state
        sidebar.classList.toggle("expanded");

        // Toggle body shift for content
        body.classList.toggle("sidebar-open");

        // Toggle overlay for mobile
        if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE && overlay) {
            overlay.classList.toggle(CONFIG.CLASSES.ACTIVE);
        }

        // Update ARIA attributes
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', !isExpanded);
        }
    };

    /**
     * Close sidebar
     */
    const closeSidebar = () => {
        if (!sidebar) return;

        sidebar.classList.remove(CONFIG.CLASSES.EXPANDED);
        body.classList.remove(CONFIG.CLASSES.SIDEBAR_OPEN);

        if (overlay) {
            overlay.classList.remove(CONFIG.CLASSES.ACTIVE);
        }

        // Update ARIA attributes
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    };

    // Event listeners
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Toggle sidebar menu');
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // =========================================
    // USER AUTHENTICATION DISPLAY
    // =========================================
    /**
     * Update UI for authenticated user
     */
       // =========================================
    // USER AUTHENTICATION DISPLAY
    // =========================================
    /**
     * Update UI untuk user yang sudah login
     */
    const updateAuthenticatedUserUI = () => {
        const initial = userData.username.charAt(0).toUpperCase();

        if (navAuthSection) {
            navAuthSection.innerHTML = `
                <button class="google-avatar" onclick="toggleProfilePopup()" 
                        title="${userData.username}" aria-label="Buka menu profil" 
                        aria-haspopup="true" aria-expanded="false">
                    <span>${initial}</span>
                </button>

                <div id="profilePopup" class="profile-popup" role="menu" aria-label="Menu profil">
                    <div class="profile-popup-header">
                        <div class="popup-avatar-large">${initial}</div>
                        <div class="popup-user-info">
                            <div class="popup-name">${userData.username}</div>
                            <div class="popup-role">${userData.role === 'admin' ? 'Administrator' : 'Mahasiswa'}</div>
                        </div>
                    </div>
                    <button onclick="logoutUser()" class="btn-popup-logout" role="menuitem">
                        Keluar
                    </button>
                </div>
            `;
        }

        // sidebar info
        if (sidebarUsername) sidebarUsername.textContent = userData.username;
        if (sidebarRole) sidebarRole.textContent = userData.role === 'admin' ? 'Administrator' : 'Mahasiswa';
        if (avatarInitial) avatarInitial.textContent = initial;

        // tampilkan link admin jika admin
        if (userData.role === 'admin' && linkAdmin) {
            linkAdmin.classList.remove(CONFIG.CLASSES.D_NONE);
            linkAdmin.style.display = 'flex';
        }
    };

    /**
     * UI untuk guest (belum login)
     */
    const updateGuestUserUI = () => {
        if (navAuthSection) {
            navAuthSection.innerHTML = `
                <a href="login.html" class="btn-login-nav" aria-label="Masuk">
                    Login
                </a>
            `;
        }
    };
    
// =========================================
// USER DATA FROM LOCALSTORAGE
// =========================================
const userData = {
    isLoggedIn: localStorage.getItem(CONFIG.STORAGE_KEYS.IS_LOGGED_IN) === 'true',
    username: localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME) || 'Guest',
    role: localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE) || 'user'
};

// =========================================
// INISIALISASI UI BERDASARKAN STATUS LOGIN
// =========================================
const isReallyLoggedIn =
    userData.isLoggedIn || userData.username !== 'Guest';

if (isReallyLoggedIn) {
    updateAuthenticatedUserUI();
} else {
    updateGuestUserUI();
}



    // =========================================
    // ACCESSIBILITY & KEYBOARD SUPPORT
    // =========================================
    /**
     * Handle keyboard navigation for sidebar
     */
    const initializeKeyboardSupport = () => {
        // Escape key to close sidebar
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                // Close sidebar if open
                if (sidebar && sidebar.classList.contains(CONFIG.CLASSES.EXPANDED)) {
                    sidebar.classList.remove(CONFIG.CLASSES.EXPANDED);
                    body.classList.remove(CONFIG.CLASSES.SIDEBAR_OPEN);
                    if (overlay) overlay.classList.remove(CONFIG.CLASSES.ACTIVE);
                }

                // Close profile popup if open
                const popup = document.querySelector(CONFIG.SELECTORS.PROFILE_POPUP);
                if (popup && popup.classList.contains(CONFIG.CLASSES.ACTIVE)) {
                    popup.classList.remove(CONFIG.CLASSES.ACTIVE);
                    const avatarBtn = document.querySelector('.google-avatar');
                    if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Menu button keyboard support
        if (menuBtn) {
            menuBtn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    menuBtn.click();
                }
            });
        }
    };

    // Initialize keyboard support
    initializeKeyboardSupport();

    // =========================================
    // GLOBAL FUNCTIONS
    // =========================================
    /**
     * Toggle profile popup visibility
     * @global
     */
    window.toggleProfilePopup = function() {
        const popup = document.querySelector(CONFIG.SELECTORS.PROFILE_POPUP);
        if (!popup) {
            console.warn('Profile popup not found');
            return;
        }

        const isActive = popup.classList.contains(CONFIG.CLASSES.ACTIVE);
        popup.classList.toggle(CONFIG.CLASSES.ACTIVE);

        // Update ARIA attributes
        const avatarBtn = document.querySelector('.google-avatar');
        if (avatarBtn) {
            avatarBtn.setAttribute('aria-expanded', !isActive);
        }

        // Close popup when clicking outside
        if (!isActive) {
            const closePopup = (event) => {
                if (!popup.contains(event.target) && !avatarBtn.contains(event.target)) {
                    popup.classList.remove(CONFIG.CLASSES.ACTIVE);
                    avatarBtn.setAttribute('aria-expanded', 'false');
                    document.removeEventListener('click', closePopup);
                }
            };
            setTimeout(() => document.addEventListener('click', closePopup), 0);
        }
    };

    /**
     * Logout user and redirect to login page
     * @global
     */
window.logoutUser = function() {
    if (confirm("Keluar dari akun?")) {
        try {
            // Hapus HANYA data login
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('isAdminLoggedIn'); // kalau ada

            // JANGAN sentuh localStorage 'theme'
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error during logout:', error);
            window.location.href = 'login.html';
        }
    }
};
});

