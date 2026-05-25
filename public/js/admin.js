const productForm = document.querySelector(".product-form");
const tableBody = document.querySelector(".table-body");
const totalProducts = document.querySelector("#total-products");
const token = sessionStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("ummuMujahid_user"));

if (!user || user.role !== "admin") {
  window.location.href = "/login";
}

// ===================== LOAD PRODUCTS =====================
async function loadProducts() {

  try {
    const res = await fetch("/products");
    const products = await res.json();

    renderProducts(products);

  } catch (err) {
    console.log(err);
  }
}


// ===================== RENDER PRODUCTS =====================
function renderProducts(products) {

  tableBody.innerHTML = "";
  totalProducts.textContent = products.length;

  products.forEach(product => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>₦${Number(product.price).toLocaleString()}</td>
      <td>${product.category || "-"}</td>
      <td>${product.stock ?? 0}</td>
    `;

    tableBody.appendChild(row);
  });
}


// ===================== ADD PRODUCT =====================
productForm.addEventListener("submit", async (e) => {

  e.preventDefault();
    console.log('sent');
  const payload = {
    name: document.querySelector(".product-name").value,
    price: document.querySelector(".product-price").value,
    image_url: document.querySelector(".product-image").value,
    category: document.querySelector(".product-category").value,
    description: document.querySelector(".product-description").value,
    stock: document.querySelector(".product-stock").value
  };

  try {
const res = await fetch("/admin/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(payload)
});

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    productForm.reset();
    loadProducts(); // refresh table

  } catch (err) {
    console.log(err);
    alert(err.message);
  }

});


// INIT
loadProducts();