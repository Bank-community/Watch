/* =========================================
   SHHUTUP™ - STORE & CART LOGIC
   =========================================
*/

let products = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupCartUI();
});

// 1. FETCH PRODUCTS FROM JSON
async function fetchProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('product-grid').innerHTML = '<p style="color:red; text-align:center; grid-column:1/-1;">Error loading luxury collection. Please try again.</p>';
    }
}

// 2. RENDER PRODUCTS ON SCREEN
function renderProducts(productsToRender) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; // Clear skeletons

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.tag ? `<div class="product-badge">${product.tag}</div>` : ''}
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <p class="section-tag" style="font-size:0.7rem; margin-bottom:5px;">${product.collection}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-row">
                    <span class="price-current">₹${product.price}</span>
                    <span class="price-mrp">₹${product.mrp}</span>
                    <span class="discount-text">${product.discount}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart('${product.id}')">ADD TO CART</button>
                    <button class="btn-quick-wishlist"><i class="fa-regular fa-heart"></i></button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. CART UI SETUP (Open / Close Drawer)
function setupCartUI() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    const openCart = () => cartDrawer.classList.add('active');
    const closeCart = () => cartDrawer.classList.remove('active');

    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

// 4. ADD TO CART LOGIC
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    
    // ओपन कार्ट ड्रॉर ऑटोमैटिकली
    document.getElementById('cart-drawer').classList.add('active');
};

// 5. UPDATE CART DISPLAY & TOTALS
function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartSubtotal = document.getElementById('cart-subtotal-price');

    // Update Counts
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
    cartItemsCount.innerText = totalItems;

    // Update Items List
    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart-message">Your luxury tray is empty.</div>';
        cartSubtotal.innerText = '₹0';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.style.display = 'flex';
        cartItem.style.gap = '15px';
        cartItem.style.marginBottom = '20px';
        cartItem.style.borderBottom = '1px solid var(--border-color)';
        cartItem.style.paddingBottom = '15px';

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: contain; background: var(--bg-main); padding: 5px;">
            <div style="flex:1;">
                <h4 style="font-family: var(--font-product); font-size:0.9rem; margin-bottom:5px;">${item.name}</h4>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family: var(--font-number); color: var(--gold);">₹${item.price}</span>
                    <div style="display:flex; align-items:center; gap:10px; background: var(--bg-main); padding: 2px 8px; border-radius: 4px;">
                        <button onclick="changeQuantity(${index}, -1)" style="color:var(--text-primary);">-</button>
                        <span style="font-family: var(--font-number); font-size:0.9rem;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="color:var(--text-primary);">+</button>
                    </div>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    cartSubtotal.innerText = `₹${total}`;
}

// 6. CHANGE QUANTITY
window.changeQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove item if quantity goes to 0
    }
    updateCartUI();
};
