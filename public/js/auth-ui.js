const userStatus = document.querySelector(".user-status");
const loginIcon = document.querySelector(".user-login");
const dropdown = document.querySelector(".user-dropdown");
const userMenu = document.querySelector(".user-menu");
const logoutBtn = document.querySelector(".logout-btn");

// ================= CHECK LOGIN STATE =================
function checkAuthUI() {
  const user = JSON.parse(localStorage.getItem("ummuMujahid_user"));

  if (user) {
    userStatus.classList.remove("hidden");
    loginIcon.classList.add("hidden");
  } else {
    userStatus.classList.add("hidden");
    loginIcon.classList.remove("hidden");
    dropdown.classList.add("hidden");
  }
}

// ================= TOGGLE DROPDOWN =================
loginIcon?.addEventListener("click", (e) => {
  e.preventDefault();
  dropdown.classList.toggle("hidden");
});

// click outside closes dropdown
document.addEventListener("click", (e) => {
  if (!userMenu.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});

// ================= LOGOUT =================
logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("ummuMujahid_user");
  checkAuthUI();
});

// init
checkAuthUI();