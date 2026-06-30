/* =========================================
   SHHUTUP™ — LANDING PAGE & CART LOGIC v2.0
   Firebase-Powered with Premium Interactions
   ========================================= */

import { initFirebase, ref, get, child, push, set } from './firebase-setup.js';

let products = [];
let allProducts = []; // Unfiltered products for tab filtering
let cart = JSON.parse(localStorage.getItem('shhutup_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('shhutup_wishlist')) || [];

document.addEventListener('DOMContentLoaded', async () => {
    setupCartUI();
    setupWishlistDrawer();
    updateCartUI();
    
    await fetchHeroImage(); 
    await fetchFeaturedProducts();
    await fetchGalleryImages(); // <-- यहाँ से // हटा दिया गया है, अब इमेज लोड होगी!
    await fetchSocialLinks(); 

    updateWishlistUI();




    // Listen for collection tab filter events from app.js
    window.addEventListener('collection-filter', (e) => {
        const filter = e.detail.filter;
        filterProducts(filter);
    });

    // Database me email save karne ka logic
    window.addEventListener('newsletter-subscribe', async (e) => {
        const email = e.detail.email;
        try {
            const { db } = await initFirebase();
            const newSubscriberRef = push(ref(db, 'subscribers'));
            await set(newSubscriberRef, { 
                email: email, 
                date: new Date().toISOString() 
            });
        } catch (error) {
            console.error('Error saving subscriber to Firebase:', error);
        }
    });
});

// ==========================================
// FETCH HERO IMAGE FROM FIREBASE
// ==========================================
async function fetchHeroImage() {
    try {
        const { db } = await initFirebase();
        const heroRef = ref(db, `settings/hero`);
        const snapshot = await get(heroRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const watchImg = document.getElementById('hero-watch');
            
            if (watchImg && data.imageUrl) {
                watchImg.src = data.imageUrl;
                watchImg.style.opacity = '1'; 
            }
        }
    } catch (error) {
        console.error('Error loading hero image from Firebase:', error);
    }
}

// ==========================================
// FETCH LIFESTYLE GALLERY FROM FIREBASE
// ==========================================
async function fetchGalleryImages() {
    try {
        const { db } = await initFirebase();
        // हम मान रहे हैं कि एडमिन पैनल डेटा को 'settings/gallery' नोड में सेव करेगा
        const galleryRef = ref(db, `settings/gallery`);
        const snapshot = await get(galleryRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const galleryGrid = document.getElementById('dynamic-gallery-grid');
            
            if (galleryGrid && data) {
                // Firebase डेटा को ऐरे (Array) में बदलकर सिर्फ 3 इमेजेज ले रहे हैं (डिज़ाइन के अनुसार)
                const galleryItems = Object.values(data).slice(0, 3);
                
                if (galleryItems.length > 0) {
                    galleryGrid.innerHTML = ''; // पुरानी हार्डकोडेड इमेजेज को हटा दो
                    
                    galleryItems.forEach((item, index) => {
                        // पहला आइटम लार्ज होगा, बाकी छोटे
                        const isLarge = index === 0 ? 'large' : '';
                        const delayClass = index === 0 ? '' : `reveal-delay-${index}`;
                        
                        const itemHTML = `
                            <div class="gallery-item ${isLarge} reveal revealed ${delayClass}">
                                <div class="gallery-overlay"><span>${item.title || 'THE AESTHETIC'}</span></div>
                                <div class="gallery-bg-placeholder" style="background: linear-gradient(rgba(0,0,0,0.3), rgba(3,3,3,0.85)), url('${item.imageUrl}') center/cover;"></div>
                            </div>
                        `;
                        galleryGrid.innerHTML += itemHTML;
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error loading gallery from Firebase:', error);
    }
}

// ==========================================
// FETCH SOCIAL LINKS FROM FIREBASE
// ==========================================
async function fetchSocialLinks() {
    try {
        const { db } = await initFirebase();
        const socialRef = ref(db, `settings/social`);
        const snapshot = await get(socialRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // 1. WhatsApp नंबर को LocalStorage में सेव करो ताकि Checkout को मिल सके
            if (data.whatsapp) {
                localStorage.setItem('shhutup_wa_number', data.whatsapp);
            }

            // 2. फ्रंटएंड में लिंक्स अपडेट करने का लॉजिक
            const updateLink = (id, url, prefix = '') => {
                const el = document.getElementById(id);
                if (el && url) el.href = prefix + url;
            };

            updateLink('link-instagram', data.instagram);
            updateLink('link-youtube', data.youtube);
            updateLink('link-facebook', data.facebook);
            updateLink('link-pinterest', data.pinterest);
            updateLink('link-mail', data.mail, 'mailto:');
        }
    } catch (error) {
        console.error('Error loading social links from Firebase:', error);
    }
}

// ==========================================
// 1. FETCH FEATURED PRODUCTS FROM FIREBASE
// ==========================================
async function fetchFeaturedProducts() {
    const grid = document.getElementById('product-grid');
    try {
        const { db } = await initFirebase();
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `products`));

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            products = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .filter(product => product.isFeatured === true)
                .slice(0, 8); 

            allProducts = [...products];
            renderProducts(products);
        } else {
            grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:1/-1;">No featured timepieces available right now.</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        grid.innerHTML = '<p style="color:var(--danger); text-align:center; grid-column:1/-1;">Error connecting to secure database.</p>';
    }
}

// ==========================================
// 2. FILTER PRODUCTS BY COLLECTION
// ==========================================
function filterProducts(filter) {
    const grid = document.getElementById('product-grid');
    
    // Fade out current cards
    const currentCards = grid.querySelectorAll('.product-card');
    currentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
    });

    setTimeout(() => {
        if (filter === 'all') {
            products = [...allProducts];
        } else {
            products = allProducts.filter(p => p.collection === filter);
        }
        renderProducts(products);
    }, 300);
}

// ==========================================
// 3. RENDER PRODUCTS ON SCREEN (1 Single, 2 Double, 1 Button)
// ==========================================
function renderProducts(productsToRender) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = ''; 

    if (productsToRender.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:1/-1;">No masterpieces found in this collection.</p>';
        return;
    }

    // सिर्फ पहले 3 प्रोडक्ट्स को ही स्क्रीन पर दिखाएंगे
    const displayProducts = productsToRender.slice(0, 3);

    displayProducts.forEach((product, index) => {
        const isWishlisted = wishlist.includes(product.id);
        const formattedPrice = window.formatINR ? window.formatINR(product.price) : `₹${product.price}`;
        const formattedMRP = window.formatINR ? window.formatINR(product.mrp) : `₹${product.mrp}`;

        const card = document.createElement('div');
        card.className = 'product-card';
        
        // CSS Grid मैजिक: Classes ऐड करेंगे ताकि PC में डिज़ाइन बदल सके
        if (index === 0) {
            card.classList.add('grid-item-main');
        } else if (index === 1) {
            card.classList.add('grid-item-side-1');
        } else if (index === 2) {
            card.classList.add('grid-item-side-2');
        }

        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        card.innerHTML = `
            ${product.tag ? `<div class="product-badge">${product.tag}</div>` : ''}
            <div class="product-image-wrapper" onclick="window.location.href='product-details.html?id=${product.id}'" style="cursor: pointer;" title="View Details">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-info">
                <p class="section-tag" style="font-size:0.65rem; margin-bottom:5px;">${product.collection}</p>
                <h3 class="product-title" onclick="window.location.href='product-details.html?id=${product.id}'" style="cursor: pointer;">${product.name}</h3>
                <div class="product-price-row">
                    <span class="price-current">${formattedPrice}</span>
                    <span class="price-mrp">${formattedMRP}</span>
                    <span class="discount-text">${product.discount}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" data-product-id="${product.id}">ADD TO CART</button>
                    <button class="btn-quick-wishlist ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}">
                        <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);

        // Staggered entrance animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        });
    });

    // "View More Products" बटन ऐड करना (Random Product Redirect के साथ)
    if (allProducts.length > 0) {
        const btnContainer = document.createElement('div');
        btnContainer.style.gridColumn = '1 / -1';
        btnContainer.style.textAlign = 'center';
        btnContainer.style.marginTop = '2.5rem';
        btnContainer.style.marginBottom = '1.5rem';
        
        btnContainer.innerHTML = `
            <button id="random-product-btn" style="background: var(--luxury-blue); color: #fff; border: none; padding: 15px 35px; font-size: 0.95rem; font-family: var(--font-heading); font-weight: bold; border-radius: 5px; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; transition: 0.3s; box-shadow: 0 5px 20px rgba(27, 77, 255, 0.2);">
                VIEW MORE PRODUCTS
            </button>
        `;
        grid.appendChild(btnContainer);

        // रैंडम प्रोडक्ट पर रीडायरेक्ट करने का लॉजिक
        document.getElementById('random-product-btn').addEventListener('click', () => {
            // सारे प्रोडक्ट्स में से कोई भी एक रैंडम प्रोडक्ट छांटें
            const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
            window.location.href = `product-details.html?id=${randomProduct.id}`;
        });
    }

    // Event delegation for add to cart & wishlist buttons
    grid.addEventListener('click', handleProductGridClick);

    // Initialize Vanilla Tilt 3D Effect on Desktop
    if (window.innerWidth > 768 && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.product-card'), {
            max: 8,          
            speed: 400,       
            glare: true,      
            'max-glare': 0.1,
            scale: 1.02       
        });
    }
}

// ==========================================
// 4. PRODUCT GRID EVENT DELEGATION
// ==========================================
function handleProductGridClick(e) {
    // Add to Cart
    const addCartBtn = e.target.closest('.btn-add-cart');
    if (addCartBtn) {
        const productId = addCartBtn.dataset.productId;
        addToCart(productId);
        
        // Button animation
        addCartBtn.classList.add('added');
        addCartBtn.textContent = '✓ ADDED';
        setTimeout(() => {
            addCartBtn.classList.remove('added');
            addCartBtn.textContent = 'ADD TO CART';
        }, 1500);
        return;
    }

    // Wishlist toggle
    const wishlistBtn = e.target.closest('.btn-quick-wishlist');
    if (wishlistBtn) {
        const productId = wishlistBtn.dataset.wishlistId;
        toggleWishlist(productId);
        return;
    }
}

// ==========================================
// 5. CART LOGIC
// ==========================================
function setupCartUI() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    const openCart = () => {
        cartDrawer.classList.add('active');
        document.body.style.overflowY = 'hidden';
    };
    const closeCart = () => {
        cartDrawer.classList.remove('active');
        document.body.style.overflowY = 'auto';
    };

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    updateCartUI();
    document.getElementById('cart-drawer').classList.add('active');
    document.body.style.overflowY = 'hidden';
}

// Expose globally
window.addToCart = addToCart;

window.changeQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartSubtotal = document.getElementById('cart-subtotal-price');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = totalItems;
    if (cartItemsCount) cartItemsCount.innerText = totalItems;

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart-message">Your luxury tray is empty.</div>';
        if (cartSubtotal) cartSubtotal.innerText = '₹0';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const formattedPrice = window.formatINR ? window.formatINR(item.price) : `₹${item.price}`;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-meta">
                    <span class="cart-item-price">${formattedPrice}</span>
                    <div class="cart-item-actions">
                        <button class="cart-wishlist-btn" onclick="moveCartToWishlist('${item.id}')" title="Move to Wishlist">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                        <div class="quantity-stepper">
                            <button onclick="changeQuantity(${index}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    if (cartSubtotal) {
        cartSubtotal.innerText = window.formatINR ? window.formatINR(total) : `₹${total}`;
    }
}

// ==========================================
// 6. WISHLIST LOGIC
// ==========================================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    localStorage.setItem('shhutup_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    renderProducts(products);
}

window.toggleWishlist = toggleWishlist;

function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlistDrawerCount = document.getElementById('wishlist-drawer-count');
    const wishlistList = document.getElementById('wishlist-items-list');

    if (wishlistCount) wishlistCount.innerText = wishlist.length;
    if (wishlistDrawerCount) wishlistDrawerCount.innerText = wishlist.length;

    if (!wishlistList) return;

    if (wishlist.length === 0) {
        wishlistList.innerHTML = '<div class="empty-cart-message">Your luxury wishlist is empty.</div>';
        return;
    }

    wishlistList.innerHTML = '';
    wishlist.forEach(id => {
        const product = products.find(p => p.id === id);
        if (!product) return; 

        const formattedPrice = window.formatINR ? window.formatINR(product.price) : `₹${product.price}`;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${product.name}</h4>
                <div class="cart-item-meta">
                    <span class="cart-item-price">${formattedPrice}</span>
                    <div class="cart-item-actions" style="gap:8px;">
                        <button onclick="moveWishlistToCart('${product.id}')" style="background:var(--luxury-blue); color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.7rem; font-weight:bold; cursor:pointer; font-family:var(--font-product);">ADD TO CART</button>
                        <button onclick="toggleWishlist('${product.id}')" style="color:var(--danger); background:none; border:none; font-size:1.1rem; cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
        `;
        wishlistList.appendChild(itemEl);
    });
}

// ==========================================
// 7. SETUP WISHLIST DRAWER
// ==========================================
function setupWishlistDrawer() {
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistToggleBtn = document.getElementById('wishlist-toggle-btn');
    const wishlistCloseBtn = document.getElementById('wishlist-close-btn');
    const wishlistOverlay = document.getElementById('wishlist-overlay');

        if (wishlistToggleBtn && wishlistDrawer) {
        const openWishlist = () => {
            updateWishlistUI();
            wishlistDrawer.classList.add('active');
            document.body.style.overflowY = 'hidden';

        };
        const closeWishlist = () => {
            wishlistDrawer.classList.remove('active');
            document.body.style.overflowY = 'auto';
        };

        wishlistToggleBtn.addEventListener('click', openWishlist);
        if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlist);
        if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);
    }
}

// ==========================================
// 8. MOVE BETWEEN CART AND WISHLIST
// ==========================================
window.moveCartToWishlist = function(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('shhutup_wishlist', JSON.stringify(wishlist));
    }
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    }
    updateCartUI();
    updateWishlistUI();
    renderProducts(products); 
};

window.moveWishlistToCart = function(productId) {
    addToCart(productId);
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('shhutup_wishlist', JSON.stringify(wishlist));
    }
    const drawer = document.getElementById('wishlist-drawer');
    if (drawer) drawer.classList.remove('active');
    document.body.style.overflowY = 'auto';
    updateWishlistUI();
    renderProducts(products); 
};