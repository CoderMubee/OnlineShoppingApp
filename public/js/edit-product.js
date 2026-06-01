const form = document.querySelector(".edit-product-form");

const token = sessionStorage.getItem("token");

const params = new URLSearchParams(
  window.location.search
);

const productId = params.get("id");


// ===================== LOAD PRODUCT =====================

async function loadProduct() {

  try {

    const res = await fetch(
      `/products/${productId}`
    );

    const product = await res.json();

    document.querySelector(".product-name").value =
      product.name || "";

    document.querySelector(".product-price").value =
      product.price || "";

    document.querySelector(".product-image").value =
      product.image_url || "";

    document.querySelector(".product-category").value =
      product.category || "";

    document.querySelector(".product-description").value =
      product.description || "";

    document.querySelector(".product-stock").value =
      product.stock || 0;

  } catch (err) {

    console.log(err);

    alert("Failed to load product");

  }

}


// ===================== UPDATE PRODUCT =====================

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const payload = {

    name: document.querySelector(".product-name").value,

    price: document.querySelector(".product-price").value,

    image_url: document.querySelector(".product-image").value,

    category: document.querySelector(".product-category").value,

    description:
      document.querySelector(".product-description").value,

    stock: document.querySelector(".product-stock").value

  };

  try {

    const res = await fetch(
      `/admin/products/${productId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    alert("Product updated successfully");

    window.location.href =
      "/admin/dashboard.html";

  } catch (err) {

    console.log(err);

    alert(err.message);

  }

});


// ===================== INIT =====================

loadProduct();