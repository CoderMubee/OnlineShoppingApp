const productId =
    window.location.pathname.split("/").pop();

//====== (FUNCTION) Get User Identity ======  
function getUser() {
    return JSON.parse(
        localStorage.getItem("ummuMujahid_user")
    );
}
//====== (FUNCTION) Load Product by Id ======
async function loadProduct() {

    try {

        const res =
            await fetch(`/products/${productId}`);

        const product =
            await res.json();

        renderProduct(product);

    } catch (err) {

        console.log(err);

    }

}

loadProduct();

//======== (EVENT) Add to Cart Event ==============
const addCartBtn = document.querySelector(".add-cart-btn");

addCartBtn.addEventListener("click", addToCart);


// ======= (FUNCTION) Logic to Render Products =========
function renderProduct(product) {

    document.querySelector(".product-image").src =
        product.image_url;

    document.querySelector(".product-name").textContent =
        product.name;

    document.querySelector(".product-price").textContent =
        `₦${Number(product.price).toLocaleString()}`;

    document.querySelector(".product-category").textContent =
        `Category: ${product.category}`;

    document.querySelector(".product-stock").textContent =
        `Stock: ${product.stock}`;

    document.querySelector(".product-description").textContent =
        product.description;

}

//======= (FUNCTION) Add Items to Cart =======
async function addToCart() {

    const user = getUser();

    if (!user) {

        window.location.href = "/login";

        return;
    }

    try {

        const res = await fetch("/cart/add", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_id: user.id,
                product_id: productId,
                quantity: 1
            })

        });

        const data = await res.json();


        if (!res.ok) {

            showToast(data.message, "error");

            return;
        }

        showToast(
            "Product added to cart",
            "success"
        );

        addCartBtn.disabled = true;
        addCartBtn.textContent = "✓ Added";

        setTimeout(() => {

            addCartBtn.disabled = false;
            addCartBtn.textContent = "Add To Cart";

        }, 2000);

    } catch (err) {

        console.log(err);

    }

}



