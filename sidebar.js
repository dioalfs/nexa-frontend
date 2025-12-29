document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (menuBtn) {
    menuBtn.onclick = () => {
      sidebar.classList.toggle("expanded");
      document.body.classList.toggle("sidebar-open");
      if (overlay) overlay.classList.toggle("active");
    };
  }

  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove("expanded");
      document.body.classList.remove("sidebar-open");
      overlay.classList.remove("active");
    };
  }
});
