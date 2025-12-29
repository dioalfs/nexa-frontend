import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const nav = document.getElementById("navAuthSection");
  if (!nav) return;

  const { data: { user } } = await supabase.auth.getUser();

  // BELUM LOGIN
  if (!user) {
    nav.innerHTML = `<a href="login.html" class="btn-login-nav">Login</a>`;
    return;
  }

  const initial = user.email[0].toUpperCase();

  nav.innerHTML = `
    <div class="profile-wrapper">
      <div id="avatarBtn" class="avatar">${initial}</div>

      <div id="profileDropdown" class="profile-dropdown hidden">
        <div class="profile-info">
          <div class="avatar avatar-lg">${initial}</div>
          <p>${user.email}</p>
        </div>
        <hr>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  `;

  const dropdown = document.getElementById("profileDropdown");

  document.getElementById("avatarBtn").onclick = () => {
    dropdown.classList.toggle("hidden");
  };

  document.getElementById("logoutBtn").onclick = async () => {
    await supabase.auth.signOut();
    window.location.replace("login.html");
  };
});
