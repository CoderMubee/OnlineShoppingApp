// ===================== PRODUCTS =====================
let allProducts = [];
const productsGrid = document.querySelector(".products__grid");

async function loadProducts() {
  try {
    const response = await fetch("/products");
    const products = await response.json();

    allProducts = products;
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function displayProducts(products) {
  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("products__item", "product-card");

    productCard.innerHTML = `
      <span class="product-card__badge product-card__badge--discount">25% Off</span>
      <img src="${product.image_url}" class="product-card__image" alt="${product.name}">
      <div class="product-card__body">
        <h5 class="product-card__title">${product.name}</h5>
        <p class="product-card__price">₦${product.price.toLocaleString()}</p>
        <button class="product-card__button">Add to Cart</button>
      </div>
    `;

    productCard.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!e.target.classList.contains("product-card__button")) {
        showProductDetails(product);
      }
    });

    productsGrid.appendChild(productCard);
  });
}

loadProducts();

//LOGIN
const user= JSON.parse(localStorage.getItem('ummuMujahid_user'));

const loginIcon = document.querySelector(".user-login");
const userStatus = document.querySelector(".user-status");
const dropdown = document.querySelector(".user-dropdown");
const logoutBtn = document.querySelector(".logout-btn");
const userAccount = document.querySelector(".user-account");
const userName = document.querySelector(".user-status span");
const dropdownArrow = document.querySelector(".dropdown-arrow");

// render UI
function renderAuth() {
  if (user) {
    loginIcon.classList.add("hidden");
    userStatus.classList.remove("hidden");
    userName.textContent = user?.full_name.split(" ")[0]||'logged in'
  } else {
    loginIcon.classList.remove("hidden");
    userStatus.classList.add("hidden");
  }
}

renderAuth();

function toggleDropdown() {
  const isHidden = dropdown.classList.toggle("hidden");

  // if dropdown is NOT hidden → rotate arrow
  dropdownArrow.classList.toggle("rotate", !isHidden);
}

//============ EVENTLISTENERS=========
userStatus.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown();
});

document.addEventListener("click", (e) => {
  if (!userAccount.contains(e.target)) {
    dropdown.classList.add("hidden");
    dropdownArrow.classList.remove("rotate");
  }
});
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("ummuMujahid_user");
  location.reload();
});