const cart = [];

function addToCart(item, price) {
    const existingItem = cart.find(cartItem => cartItem.name === item);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: item, price: price, quantity: 1 });
    }
    renderCart();
}

function removeFromCart(item) {
    const index = cart.findIndex(cartItem => cartItem.name === item);
    if (index !== -1) {
        cart[index].quantity--;
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
        }
    }
    renderCart();
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsElement.innerHTML = '';

    let totalPrice = 0;
    cart.forEach(cartItem => {
        const li = document.createElement('li');
        li.innerHTML = `${cartItem.name} - Rp. ${cartItem.price} x ${cartItem.quantity} 
            <button onclick="removeFromCart('${cartItem.name}')">-</button>`;
        cartItemsElement.appendChild(li);
        totalPrice += cartItem.price * cartItem.quantity;
    });

    totalPriceElement.textContent = totalPrice;
}

function processPayment() {
    const orderDetailsElement = document.getElementById('order-details');
    const orderTotalElement = document.getElementById('order-total');
    const modal = document.getElementById('order-modal');

    orderDetailsElement.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(cartItem => {
        const li = document.createElement('li');
        li.textContent = `${cartItem.name} - Rp. ${cartItem.price} x ${cartItem.quantity}`;
        orderDetailsElement.appendChild(li);
        totalPrice += cartItem.price * cartItem.quantity;
    });

    orderTotalElement.textContent = totalPrice;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'none';
}

function finishOrder() {
    cart.length = 0;
    renderCart();
    closeModal();
}

window.onclick = function(event) {
    const modal = document.getElementById('order-modal');
    if (event.target == modal) {
        closeModal();
    }
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

