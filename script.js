
document.addEventListener("DOMContentLoaded", function () {
  const lddPurchasePhone = "tel:+18149274890";

  const serviceCards = document.querySelectorAll(".ldd-service-card");
  const cartItemsBox = document.getElementById("lddCartItems");
  const cartCount = document.getElementById("lddCartCount");
  const cartTotal = document.getElementById("lddCartTotal");
  const cartEmpty = document.getElementById("lddCartEmpty");
  const clearCartBtn = document.getElementById("lddClearCart");

  let cart = JSON.parse(localStorage.getItem("lddCart")) || [];

  function saveCart() {
    localStorage.setItem("lddCart", JSON.stringify(cart));
  }

  function updateCardButtons() {
    serviceCards.forEach(function (card) {
      const title = card.dataset.title;
      const heartButton = card.querySelector(".ldd-fav-cart-btn");

      const exists = cart.some(function (item) {
        return item.title === title;
      });

      if (exists) {
        card.classList.add("ldd-card-added");

        if (heartButton) {
          heartButton.classList.add("ldd-added");
        }
      } else {
        card.classList.remove("ldd-card-added");

        if (heartButton) {
          heartButton.classList.remove("ldd-added");
        }
      }
    });
  }

  function renderCart() {
    if (!cartItemsBox || !cartCount || !cartTotal || !cartEmpty) {
      updateCardButtons();
      return;
    }

    cartItemsBox.innerHTML = "";

    if (cart.length === 0) {
      cartEmpty.classList.remove("d-none");
    } else {
      cartEmpty.classList.add("d-none");
    }

    let total = 0;

    cart.forEach(function (item, index) {
      total += Number(item.price);

      cartItemsBox.innerHTML += `
        <div class="ldd-cart-item">
          <img src="${item.img}" alt="${item.title}">

          <div class="flex-grow-1">
            <div class="ldd-cart-item-title">${item.title}</div>
            <div class="ldd-cart-item-price">$${Number(item.price).toFixed(2)}</div>

            <div class="ldd-cart-actions">
              <button class="ldd-remove-cart-btn" type="button" data-index="${index}">
                <i class="fa-solid fa-trash me-1"></i>
                Remove
              </button>

              <a class="ldd-purchase-cart-btn" href="${lddPurchasePhone}">
                <i class="fa-solid fa-phone me-1"></i>
                Purchase
              </a>
            </div>
          </div>
        </div>
      `;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = "$" + total.toFixed(2);

    updateCardButtons();
  }

  serviceCards.forEach(function (card) {
    card.addEventListener("click", function () {
      const item = {
        title: card.dataset.title,
        price: card.dataset.price,
        img: card.dataset.img
      };

      const alreadyAdded = cart.some(function (cartItem) {
        return cartItem.title === item.title;
      });

      if (!alreadyAdded) {
        cart.push(item);
        saveCart();
        renderCart();
      }
    });
  });

  if (cartItemsBox) {
    cartItemsBox.addEventListener("click", function (e) {
      const removeBtn = e.target.closest(".ldd-remove-cart-btn");

      if (removeBtn) {
        const index = removeBtn.dataset.index;
        cart.splice(index, 1);
        saveCart();
        renderCart();
      }
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", function () {
      cart = [];
      saveCart();
      renderCart();
    });
  }

  renderCart();
});
