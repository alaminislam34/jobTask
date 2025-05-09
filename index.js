const addToCartBtn = document.querySelector(".btn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCartBtn = document.getElementById("closeCart");

const quantityElement = document.querySelector(".content .quantity"); // main product quantity
const quantityButtons = document.querySelectorAll(".content .quantity-btn");

const totalPriceE = document.getElementById("totalPrice");
const mainImage = document.querySelector(".main-image img");
const imgButtons = document.querySelectorAll(".img-btn");

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
    totalPriceE.textContent = (basePrice * quantity).toFixed(2);
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
    totalPriceE.textContent = (storedCart.price * storedCart.quantity).toFixed(
      2
    );
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
      totalPriceElement.textContent = (product.price * qty).toFixed(2);
      totalPriceE.textContent = (product.price * qty).toFixed(2); // also update main page

      // update quantity in main page
      quantityElement.textContent = qty;

      // update localStorage
      const updatedProduct = {
        ...product,
        quantity: qty,
      };
      localStorage.setItem("cartItem", JSON.stringify(updatedProduct));
    });
  });

  // delete item
  const deleteBtn = cartItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("cartItem");
    cartContent.innerHTML = "";
    totalPriceE.textContent = basePrice.toFixed(2);
    quantityElement.textContent = "1";
  });
}

// On page load
loadCartFromStorage();
