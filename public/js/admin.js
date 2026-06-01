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

      <td>
        <button
          class="edit-btn"
          data-id="${product.id}"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          data-id="${product.id}"
        >
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

}
// delete operation
tableBody.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("delete-btn")) return;

  const productId = e.target.dataset.id;

  const confirmed = confirm(
    "Delete this product?"
  );

  if (!confirmed) return;

  try {

    const res = await fetch(
      `/admin/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    alert(data.message);

    loadProducts();

  } catch (err) {

    console.log(err);

  }

});
//edit operation
tableBody.addEventListener("click", (e) => {

  if (!e.target.classList.contains("edit-btn")) return;

  const productId = e.target.dataset.id;

  window.location.href =
    `/html/edit-product.html?id=${productId}`;

});

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