// Array untuk menyimpan item di keranjang
let cart = [];

// Fungsi untuk menambahkan item ke keranjang
function addToCart(itemName, itemPrice) {
    // Tambahkan item ke array keranjang
    cart.push({ name: itemName, price: itemPrice });
    updateCart(); // Perbarui tampilan keranjang
}

// Fungsi untuk memperbarui tampilan keranjang
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    let totalPrice = 0;

    // Kosongkan tampilan keranjang sebelum diperbarui
    cartItems.innerHTML = '';

    // Looping setiap item di keranjang untuk ditampilkan
    cart.forEach((item) => {
        totalPrice += item.price;
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Rp. ${item.price.toLocaleString()}`;
        
        // Tambahkan animasi saat item ditambahkan
        listItem.classList.add('added-item');
        cartItems.appendChild(listItem);

        // Hapus kelas animasi setelah selesai (500ms)
        setTimeout(() => {
            listItem.classList.remove('added-item');
        }, 500);
    });

    // Perbarui total harga
    totalPriceEl.textContent = totalPrice.toLocaleString();

    // Tambahkan animasi ke total harga
    totalPriceEl.classList.add('highlight');
    setTimeout(() => {
        totalPriceEl.classList.remove('highlight');
    }, 1000);
}
// Animasi header saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const welcomeText = document.getElementById('welcome-text');

    // Tambahkan delay sebelum animasi dimulai
    setTimeout(() => {
        welcomeText.style.width = '100%';
    }, 500); // Delay 0.5 detik
});
