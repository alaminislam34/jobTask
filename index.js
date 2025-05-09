const addToCartBtn = document.querySelector(".btn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCart");

const quantityElement = document.querySelector(".content .quantity");
const quantityButtons = document.querySelectorAll(".content .quantity-btn");

const totalPriceE = document.getElementById("totalPrice");
const drawerTotal = document.getElementById("drawerTotal");
const mainImage = document.querySelector(".main-image img");
const imgButtons = document.querySelectorAll(".img-btn");

const checkoutBtn = document.getElementById("checkoutBtn");

let basePrice = 249.0;

// Image switch with localStorage
imgButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const clickedImg = btn.querySelector("img");
    const tempSrc = mainImage.src;
    mainImage.src = clickedImg.src;
    clickedImg.src = tempSrc;
    localStorage.setItem("mainImageSrc", mainImage.src);
  });
});

// Quantity control on main content
quantityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let quantity = parseInt(quantityElement.textContent);
    if (btn.textContent === "+" && quantity < 10) {
      quantity++;
    } else if (btn.textContent === "-" && quantity > 1) {
      quantity--;
    }
    quantityElement.textContent = quantity;
    const total = (basePrice * quantity).toFixed(2);
    totalPriceE.textContent = total;
    drawerTotal.textContent = total;
  });
});

// Add to cart
addToCartBtn.addEventListener("click", () => {
  const quantity = parseInt(quantityElement.textContent);

  const product = {
    title: "Helio Pet Device ™",
    price: basePrice,
    quantity: quantity,
    img: mainImage.src,
  };

  localStorage.setItem("cartItem", JSON.stringify(product));
  renderCartItem(product);
  cartDrawer.classList.add("open");
});

// Close drawer
closeCartBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

// Load cart and image from localStorage
function loadCartFromStorage() {
  const storedCart = JSON.parse(localStorage.getItem("cartItem"));
  if (storedCart) {
    quantityElement.textContent = storedCart.quantity;
    const total = (storedCart.price * storedCart.quantity).toFixed(2);
    totalPriceE.textContent = total;
    drawerTotal.textContent = total;
    renderCartItem(storedCart);
  }

  const savedMainImage = localStorage.getItem("mainImageSrc");
  if (savedMainImage) {
    mainImage.src = savedMainImage;
  }
}

// Render cart item
function renderCartItem(product) {
  const cartContent = document.querySelector(".cart-content");
  cartContent.innerHTML = "";

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");

  cartItem.innerHTML = `
    <img src="${product.img}" alt="Product" />
    <div>
      <div class="content-container">
        <div>
          <p class="title-drawer">${product.title}</p>
          <p class="newPrice">$${product.price.toFixed(2)}</p>
        </div>
        <div>
          <p>$<span class="totalPrice newPrice">${(
            product.price * product.quantity
          ).toFixed(2)}</span></p>
        </div>
      </div>
      <div class="drawer-quantity-container">
        <div class="quantity-drawer">
          <button class="quantity-btn">-</button>
          <p class="quantity">${product.quantity}</p>
          <button class="quantity-btn">+</button>
        </div>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `;

  cartContent.appendChild(cartItem);

  const qtyElement = cartItem.querySelector(".quantity");
  const qtyBtns = cartItem.querySelectorAll(".quantity-btn");
  const totalPriceElement = cartItem.querySelector(".totalPrice");

  qtyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      let qty = parseInt(qtyElement.textContent);

      if (btn.textContent === "+" && qty < 10) {
        qty++;
      } else if (btn.textContent === "-" && qty > 1) {
        qty--;
      }

      qtyElement.textContent = qty;
      const total = (product.price * qty).toFixed(2);
      totalPriceElement.textContent = total;
      totalPriceE.textContent = total;
      drawerTotal.textContent = total;
      quantityElement.textContent = qty;

      const updatedProduct = { ...product, quantity: qty };
      localStorage.setItem("cartItem", JSON.stringify(updatedProduct));
    });
  });

  const deleteBtn = cartItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("cartItem");
    cartContent.innerHTML = "";
    quantityElement.textContent = "1";
    const total = basePrice.toFixed(2);
    totalPriceE.textContent = total;
    drawerTotal.textContent = total;
  });
}

// Toast show function
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.padding = "12px 20px";
  toast.style.background = "#28a745";
  toast.style.color = "#fff";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Checkout button click
checkoutBtn.addEventListener("click", () => {
  showToast("✅ Payment Successful!");
  localStorage.removeItem("cartItem");
  cartDrawer.classList.remove("open");
  document.querySelector(".cart-content").innerHTML = "";
  quantityElement.textContent = "1";
  totalPriceE.textContent = basePrice.toFixed(2);
  drawerTotal.textContent = basePrice.toFixed(2);
});

// On page load
loadCartFromStorage();
