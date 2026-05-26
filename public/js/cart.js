//get user cart items
const cartContainer = document.querySelector(".cart-items");
const totalElement = document.querySelector(".cart-total");

async function loadCart() {

  const user = JSON.parse(localStorage.getItem("ummuMujahid_user"));

  if (!user) {
    window.location.href = "/html/login.html";
    return;
  }

  try {

    const res = await fetch(`/cart/${user.id}`);
    const cartItems = await res.json();

    renderCart(cartItems);

  } catch (err) {
    console.log(err);
  }
}


function renderCart(items) {

  cartContainer.innerHTML = "";

  let total = 0;

  items.forEach(item => {

    total += item.price * item.quantity;

    const cartItem = document.createElement("div");

    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
  <img src="${item.image_url}" class="cart-item__image">

  <div class="cart-item__details">

    <h3>${item.name}</h3>

    <p class="cart-price">
      ₦${Number(item.price).toLocaleString()}
    </p>

    <p class="cart-quantity">
      Quantity: ${item.quantity}
    </p>

  </div>
`;

    cartContainer.appendChild(cartItem);
  });

  totalElement.textContent = total.toLocaleString();
}


loadCart();

//Checkout
document.querySelector(".checkout-btn")
.addEventListener("click", checkout);


async function checkout() {

  const user = JSON.parse(
    localStorage.getItem("ummuMujahid_user")
  );

  try {

    const res = await fetch("/checkout", {
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
      throw new Error(data.message);
    }

    alert(data.message);

    location.reload();

  } catch (err) {

    console.log(err);

    alert(err.message);
  }
}