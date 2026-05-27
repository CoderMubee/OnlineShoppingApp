const ordersContainer = document.querySelector(".orders-container");

const user = JSON.parse(localStorage.getItem("ummuMujahid_user"));


// FETCH USER ORDERS
async function getOrders() {

  try {

    const res = await fetch(`/orders/details/${user.id}`);

    const orders = await res.json();

    displayOrders(orders);

  } catch (error) {
    console.log(error);
  }

}

getOrders();


// DISPLAY ORDERS
function displayOrders(orders) {

  ordersContainer.innerHTML = "";

  if (orders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  orders.forEach(order => {

    ordersContainer.innerHTML += `
    
      <div class="order-card">

        <img 
          src="${order.image_url}" 
          class="order-image"
        >

        <div class="order-info">

          <h3>${order.name}</h3>

          <p class="order-qty">
            Quantity: ${order.quantity}
          </p>

          <p class="order-price">
            ₦${order.price}
          </p>

          <p class="order-status">
            Status: ${order.status}
          </p>

          <p class="order-date">
            Ordered on:
            ${new Date(order.created_at).toLocaleDateString()}
          </p>

        </div>

      </div>
    `;
  });

}