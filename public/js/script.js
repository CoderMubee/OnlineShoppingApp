// Global Variables
const productsGrid = document.querySelector(".products__grid");
const loginIcon = document.querySelector(".user-login");
const userStatus = document.querySelector(".user-status");
const dropdown = document.querySelector(".user-dropdown");
const logoutBtn = document.querySelector(".logout-btn");
const userAccount = document.querySelector(".user-account");
const userName = document.querySelector(".user-status span");
const dropdownArrow = document.querySelector(".dropdown-arrow");
const modal = document.querySelector(".product-modal");

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

// ===================== PRODUCTS =====================
let allProducts = [];
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
loadProducts();

function displayProducts(products) {
  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <img 
        src="${product.image_url}" 
        alt="${product.name}" 
        class="product-card__image"
      >
    `;

    // image event listener
    productCard.addEventListener("click", () => {
      openProductModal(product);
    });

    productsGrid.appendChild(productCard);
  });
}
// OPEN MODAL

function openProductModal(product) {
  const user = getUser();
  const addToCart_Btn = modal.querySelector(".add-cart-btn");
  const addMore_Btn = modal.querySelector(".view-more-btn");
  modal.querySelector(".modal-image").src = product.image_url;
  modal.querySelector(".modal-name").textContent = product.name;
  modal.querySelector(".modal-price").textContent =
    "₦" + Number(product.price).toLocaleString();
  addToCart_Btn.textContent = 'add to cart';
  modal.classList.remove("modal-hidden");

  addToCart_Btn.onclick = async () => {

  if (!user) {
    window.location.href = "/html/login.html";
    return;
  }

  await addToCart(product);

 showToast(
  "Product added to cart",
  "success"
);

addToCart_Btn.disabled = true;
addToCart_Btn.textContent = "✓ Added";

setTimeout(() => {

  addToCart_Btn.disabled = false;
  addToCart_Btn.textContent = "Add To Cart";

}, 2000);

};


  modal.querySelector(".view-more-btn").onclick = () => {
    window.location.href = `/product/${product.id}`;
  };
}
// CLOSE MODAL
document.querySelector(".close-modal").addEventListener("click", () => {
  document.querySelector(".product-modal").classList.add("modal-hidden");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("modal-hidden");
  }
});

//LOGIN

function getUser() {
  return JSON.parse(localStorage.getItem("ummuMujahid_user"));
}

// render UI
function renderAuth() {
  const user = getUser();
  if (user) {
    loginIcon.classList.add("hidden");
    userStatus.classList.remove("hidden");
    userName.textContent = user?.full_name.split(" ")[0] || 'logged in'
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

//USER INTERACTIONS

//add to cart
async function addToCart(product) {
  const user = getUser();
  if (!user) {
    window.location.href = "/html/login.html";
    return;
  }

  const res = await fetch("/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: user.id,
      product_id: product.id,
      quantity: 1
    })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);

    return;
  }
  updateCartCount();

}

//get user cart quantity
async function updateCartCount() {
  const user = getUser();
  console.log('hi');
  if (!user) return;

  const res = await fetch(`/cart/count/${user.id}`);
  const data = await res.json();

  document.querySelector(".cart-badge").textContent = data.total;
}
updateCartCount();