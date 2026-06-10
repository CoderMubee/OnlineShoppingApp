// get user cart items
const cartContainer = document.querySelector(".cart-items");
const totalElement = document.querySelector(".cart-total");
const checkoutBtn = document.querySelector(".checkout-btn");

// ====== Get User ======
function getUser() {
  return JSON.parse(
    localStorage.getItem("ummuMujahid_user")
  );
}

// ====== LOAD CART ======
async function loadCart() {

  const user = getUser();

  if (!user) {
    showToast("Please login first", "error");
    window.location.href = "/html/login.html";
    return;
  }

  try {

    const res = await fetch(`/cart/${user.id}`);
    const cartItems = await res.json();

    renderCart(cartItems);

  } catch (err) {
    console.log(err);
    showToast("Failed to load cart", "error");
  }
}


// ====== RENDER CART ======
function renderCart(items) {
 const user = getUser();
  cartContainer.innerHTML = "";

  let total = 0;

  items.forEach(item => {

    total += Number(item.price || 0) * Number(item.quantity || 0);

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
  <img src="${item.image_url}" class="cart-item__image">

  <div class="cart-item__details">

    <h3>${item.name}</h3>

    <p class="cart-price">₦${Number(item.price).toLocaleString()}</p>

    <div class="qty-controls">

      <button class="minus">-</button>

      <span>${item.quantity}</span>

      <button class="plus">+</button>

    </div>

    <button class="remove-btn">Remove</button>

  </div>
`;
//======= (EVENT) Increase Cart Quantity ========
    cartItem.querySelector(".plus").addEventListener("click", async () => {
     
  await fetch("/cart/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      product_id: item.product_id,
      quantity: item.quantity + 1
    })
  });
  loadCart();
});

//======= (EVENT) Decrease Cart Quantity ========
cartItem.querySelector(".minus").addEventListener("click", async () => {

  if (item.quantity <= 1) return;

  await fetch("/cart/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      product_id: item.product_id,
      quantity: item.quantity - 1
    })
  });
  loadCart();
});
//======= (EVENT) Remove Cart Quantity ========
cartItem.querySelector(".remove-btn").addEventListener("click", async () => {

  await fetch("/cart/remove", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: user.id,
      product_id: item.product_id
    })
  });
  loadCart();
});

    cartContainer.appendChild(cartItem);
  });

  totalElement.textContent = total.toLocaleString();
}


// ====== INIT ======
loadCart();


// ====== CHECKOUT ======
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", checkout);
}


async function checkout() {

  const user = getUser();

  if (!user) {
    showToast("Please login first", "error");
    window.location.href = "/html/login.html";
    return;
  }

  try {

    const res = await fetch("/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message, "error");
      return;
    }

    showToast("Order placed successfully 🎉", "success");

    // clear UI immediately (better UX)
    cartContainer.innerHTML = "";
    totalElement.textContent = "0";

    setTimeout(() => {
      window.location.href = "/html/orders.html";
    }, 1500);

  } catch (err) {
    console.log(err);
    showToast("Something went wrong", "error");
  }
}