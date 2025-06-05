// Load products from data.json
async function loadProducts() {
    const response = await fetch('../data/data.json');
    return await response.json();
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Hamburger Menu Functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Toggle Hamburger Menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close Hamburger Menu when a link is clicked
navLinks.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
})

// Navbar Scroll Effect
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { 
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Cart state (persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Homepage: Display products
if (document.getElementById('product-list')) {
    loadProducts().then(products => {
        const productList = document.getElementById('product-list');
        products.forEach(product => {
            const productCard = `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <a href="../pages/product.html?id=${product.id}">View Details</a>
          </div>
        `;
            productList.insertAdjacentHTML('beforeend', productCard);
        });
        updateCartCount();
    });
}

// Product Detail Page: Display product and add to cart
if (document.getElementById('product-detail')) {
    loadProducts().then(products => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);

        if (product) {
            const productDetail = document.getElementById('product-detail');
            productDetail.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>${product.description || 'No description available.'}</p>
          <p>Price: $${product.price}</p>
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;

            // Add to cart functionality
            document.querySelector('.add-to-cart').addEventListener('click', () => {
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                saveCart();
                updateCartCount();
                alert('Product added to cart!');
            });
        } else {
            document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
        }
        updateCartCount();
    });
}

// Cart Page: Display cart items and totals
if (document.getElementById('cart-items')) {
    function renderCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            cartItems.insertAdjacentHTML('beforeend', `
          <div class="cart-item">
            <div>
              <h2>${item.name}</h2>
              <p>$${item.price} x <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}"></p>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        `);
        });

        const shipping = 50;
        const vat = subtotal * 0.2;
        const total = subtotal + shipping + vat;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('vat').textContent = vat.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
        updateCartCount();
    }

    renderCart();

    // Update quantity
    document.addEventListener('change', e => {
        if (e.target.classList.contains('quantity-input')) {
            const id = parseInt(e.target.dataset.id);
            const quantity = parseInt(e.target.value);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity = quantity;
                saveCart();
                renderCart();
            }
        }
    });

    // Remove item
    document.addEventListener('click', e => {
        if (e.target.classList.contains('remove-item')) {
            const id = parseInt(e.target.dataset.id);
            cart = cart.filter(item => item.id !== id);
            saveCart();
            renderCart();
        }
    });
}

// Checkout Page: Form validation and order confirmation
if (document.getElementById('checkout-form')) {
    const form = document.getElementById('checkout-form');
    const modal = document.getElementById('order-modal');
    const orderSummary = document.getElementById('order-summary');
    const closeModal = document.getElementById('close-modal');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;

        if (!name || !email || !address) {
            alert('Please fill in all fields.');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email.');
            return;
        }

        // Show order confirmation
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const vat = subtotal * 0.2;
        const total = subtotal + 50 + vat;

        orderSummary.innerHTML = `
        <p>Thank you, ${name}!</p>
        <p>Order Summary:</p>
        <ul>${cart.map(item => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}</ul>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Shipping: $50</p>
        <p>VAT: $${vat.toFixed(2)}</p>
        <p>Total: $${total.toFixed(2)}</p>
      `;
        modal.classList.remove('hidden');
        cart = []; // Clear cart
        saveCart();
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        window.location.href = '../index.html';
    });
  }