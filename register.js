import { supabase } from "./supabase.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const msg = document.getElementById("msg");
  const btn = document.querySelector("button[type='submit']");

  btn.textContent = "Mendaftarkan...";
  btn.disabled = true;
  msg.style.display = "none";

  // 1️⃣ Daftar ke Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    msg.style.color = "#dc3545";
    msg.style.display = "block";
    btn.textContent = "Daftar Sekarang";
    btn.disabled = false;
    return;
  }

  // 2️⃣ Simpan profile ke table profiles
  await supabase.from("profiles").insert({
    id: data.user.id,
    email: email,
    role: "user"
  });

  msg.textContent = "Registrasi berhasil. Silakan login.";
  msg.style.color = "#28a745";
  msg.style.display = "block";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});