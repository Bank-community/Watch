/* =========================================
   SHHUTUP™ — PRODUCT DETAILS & CART SYNC v2.2
   (Swiper Height Collapse & Crash Fix)
   ========================================= */

import { initFirebase, ref, get, child } from './firebase-setup.js';

let currentProduct = null;
let wishlist = JSON.parse(localStorage.getItem('shhutup_wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('shhutup_cart')) || [];

function formatINR(num) {
    if (!num) return '₹0';
    const x = num.toString();
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
}

document.addEventListener('DOMContentLoaded', async () => {
    setupCartUI();
    setupWishlistDrawer();
    updateCartUI();
    updateWishlistUI();
    setupBackToTop();
    setupWhatsAppCheckout();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) return;
    await fetchSingleProduct(productId);
});

async function fetchSingleProduct(id) {
    const container = document.getElementById('details-container');
    try {
        const { db } = await initFirebase();
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `products/${id}`));

        if (snapshot.exists()) {
                        currentProduct = { id, ...snapshot.val() };
            renderProductDetails(currentProduct);
            saveToRecentlyViewed(id);
            loadRecentlyViewed(dbRef, id);
            fetchAllProductsForLazyLoad(dbRef); // 👈 नया लेज़ी लोड फंक्शन 
        } else {

            if (container) container.innerHTML = '<div style="text-align:center; padding:50px; color:red; font-weight:bold;">Masterpiece not found in database.</div>';
        }
    } catch (error) {
        console.error("Firebase Connection Error:", error);
        if (container) container.innerHTML = `<div style="text-align:center; padding:50px; color:red; border:1px solid red; margin:20px; border-radius:10px;"><b>Firebase Error:</b> ${error.message}</div>`;
    }
}

function renderProductDetails(product) {
    const container = document.getElementById('details-container');
    if (!container) return;

    try {
        const isWishlisted = wishlist.includes(product.id);
        
        // 1. Safe Image Processing (Handles Firebase Object/Array structure)
        let imagesList = [];
        if (product.images) {
            imagesList = Array.isArray(product.images) ? product.images : Object.values(product.images);
            imagesList = imagesList.filter(img => typeof img === 'string' && img.trim() !== '');
        }
        
        // Fallback to single image if array is empty or has only 1 image
        let mediaHTML = `<img src="${product.image || ''}" alt="${product.name || 'Watch'}" class="details-main-img single-view-img" style="width:100%; height:auto; object-fit:cover; aspect-ratio:3/4; display:block;">`;

        if (imagesList.length > 1) {
            let slides = imagesList.map(img => `<div class="swiper-slide" style="width:100%; height:100%;"><img src="${img}" style="width:100%; height:100%; object-fit:cover; aspect-ratio:3/4; display:block;"></div>`).join('');
            
            // FIXED: Added exact aspect-ratio and relative positioning to prevent height collapsing
            mediaHTML = `
                <div class="swiper mySwiper" style="width: 100%; aspect-ratio: 3/4; background: #050505; position: relative; overflow: hidden; display: block;">
                    <div class="swiper-wrapper" style="height: 100%;">${slides}</div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next" style="color: var(--luxury-blue);"></div>
                    <div class="swiper-button-prev" style="color: var(--luxury-blue);"></div>
                </div>`;
        }

        // 2. Safe Highlights Processing
        let highlightsList = [];
        if (product.highlights) {
            highlightsList = Array.isArray(product.highlights) ? product.highlights : Object.values(product.highlights);
            highlightsList = highlightsList.filter(h => typeof h === 'string' && h.trim() !== '');
        }

        let highlightsHTML = '';
        if (highlightsList.length > 0) {
            highlightsHTML = `
                <div class="product-highlights" style="margin: 1.5rem 0; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 8px;">
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                        ${highlightsList.map(h => `
                            <li style="color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: flex-start; gap: 12px; line-height: 1.4;">
                                <i class="fa-solid fa-gem" style="color: var(--gold); font-size: 0.75rem; margin-top: 4px;"></i>
                                <span>${h}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }

                   // 3. Responsive UI Render (Grid for PC, Flex for Mobile)
        container.innerHTML = `
            <div class="details-grid" style="opacity: 1 !important; transform: none !important; visibility: visible !important;">
                
                <div class="details-media-container" style="background: var(--bg-main); position: relative; width: 100%;">
                    ${mediaHTML}
                    
                    <div class="image-action-bar" style="display: flex; justify-content: flex-end; gap: 20px; padding: 0 1.5rem; position: absolute; bottom: 15px; right: 0; z-index: 10;">
                        <button class="icon-action-btn" onclick="shareProduct()" title="Share Masterpiece" style="background: none; border: none; color: var(--text-primary); font-size: 1.4rem; cursor: pointer; text-shadow: 0 2px 6px rgba(0,0,0,0.8);">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                        <button class="icon-action-btn" id="detail-wishlist-btn" onclick="toggleWishlistDetails('${product.id}')" title="Wishlist" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; text-shadow: 0 2px 6px rgba(0,0,0,0.8);">
                            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isWishlisted ? 'color: var(--danger);' : 'color: var(--text-primary);'}"></i>
                        </button>
                    </div>
                </div>
                
                <div class="details-info-box">
                    <span style="display: block; color: var(--luxury-blue); font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 6px; font-weight: bold; text-transform: uppercase;">${product.collection || 'Exclusive Collection'}</span>
                    <h1 class="details-title" style="font-size: 2.2rem; margin: 0 0 10px 0; color: #fff; font-family: var(--font-heading);">${product.name || 'Luxury Timepiece'}</h1>
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                        <span style="font-size: 1.8rem; font-weight: bold; color: #fff;">${formatINR(product.price)}</span>
                        <span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.1rem;">${formatINR(product.mrp)}</span>
                        ${product.discount ? `<span style="background: rgba(0, 200, 83, 0.15); color: var(--success); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: bold;">${product.discount}</span>` : ''}
                    </div>
                    
                    ${highlightsHTML}

                    <div style="height: 1px; background: var(--border-color); margin: 25px 0;"></div>
                    
                    <h4 style="margin-bottom:12px; color:var(--gold); font-family:var(--font-heading); letter-spacing:1px; font-size: 1.1rem;">About the Masterpiece</h4>
                    <p style="color: var(--text-secondary); line-height: 1.7; font-size: 1rem;">${product.description || ''}</p>
                    
                    <div style="margin-top: 2.5rem; display:flex; gap:12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="buyNowDetails()" style="flex:1; font-size:1rem; padding:1.2rem; min-width: 140px; background: var(--luxury-blue); color: #fff; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; text-transform: uppercase;">BUY NOW</button>
                        <button class="btn btn-secondary" id="add-cart-detail-btn" onclick="addToCartDetails()" style="flex:1; font-size:1rem; padding:1.2rem; min-width: 140px; background: transparent; border: 1px solid var(--border-color); color: #fff; border-radius: 5px; font-weight: bold; cursor: pointer; text-transform: uppercase;">ADD TO CART</button>
                    </div>
                    <div id="action-msg" style="margin-top:15px; color:var(--success); font-size:0.9rem; font-weight:600; text-align: center; height: 20px;"></div>
                </div>
            </div>
        `;


        document.title = `SHHUTUP™ | ${product.name || 'Masterpiece'}`;

        // 4. SAFELY Initialize Swiper with a delay to ensure HTML is fully painted in DOM
        if (imagesList.length > 1 && typeof Swiper !== 'undefined') {
            setTimeout(() => {
                try {
                    new Swiper(".mySwiper", { 
                        loop: true, 
                        pagination: { el: ".swiper-pagination", clickable: true }, 
                        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                        spaceBetween: 0,
                        autoHeight: true // Adjusts height dynamically if needed
                    });
                } catch (e) {
                    console.error("Swiper Initialization Error:", e);
                }
            }, 100); // 100ms delay protects against blank screen crashes
        }
    } catch (err) {
        console.error("UI Render Error:", err);
        container.innerHTML = `
            <div style="padding: 30px; text-align: center; border: 1px solid red; margin: 20px; border-radius: 10px; background: rgba(255,0,0,0.1);">
                <h3 style="color: red; margin-bottom: 10px;">UI Rendering Failed</h3>
                <p style="color: #fff;">${err.message}</p>
            </div>
        `;
    }
}

// ==========================================
// ACTION BUTTONS
// ==========================================
window.buyNowDetails = function() {
    addToCartDetails();
    document.getElementById('cart-drawer').classList.add('active');
    document.body.style.overflowY = 'hidden';
};

window.addToCartDetails = function() {
    if (!currentProduct) return;
    const existingItem = cart.find(item => item.id === currentProduct.id);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...currentProduct, quantity: 1 });
    
    localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    updateCartUI();
    
    const btn = document.getElementById('add-cart-detail-btn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ ADDED';
        btn.style.background = 'var(--success)';
        btn.style.borderColor = 'var(--success)';
        btn.style.color = '#fff';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'transparent';
            btn.style.borderColor = 'var(--border-color)';
        }, 2000);
    }

    const msg = document.getElementById('action-msg');
    if (msg) {
        msg.innerText = '✓ Added to your luxury tray';
        setTimeout(() => msg.innerText = '', 3000);
    }
};

window.toggleWishlistDetails = function(productId) {
    const index = wishlist.indexOf(productId);
    const isAdding = index === -1;
    
    // डेटाबेस/लोकल स्टोरेज अपडेट करें
    if (isAdding) wishlist.push(productId);
    else wishlist.splice(index, 1);
    
    localStorage.setItem('shhutup_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    
    // 1. मेन प्रोडक्ट का हार्ट अपडेट करें (बिना पेज रिलोड किए)
    if (currentProduct && currentProduct.id === productId) {
        const mainBtn = document.getElementById('detail-wishlist-btn');
        if (mainBtn) {
            mainBtn.innerHTML = `<i class="${isAdding ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isAdding ? 'color: var(--danger);' : 'color: var(--text-primary);'}"></i>`;
        } else {
            renderProductDetails(currentProduct); 
        }
    }

    // 2. Discover More कार्ड्स का हार्ट तुरंत अपडेट करें
    const cardBtn = document.getElementById(`card-wish-btn-${productId}`);
    const cardIcon = document.getElementById(`card-wish-icon-${productId}`);
    if (cardBtn && cardIcon) {
        cardBtn.style.color = isAdding ? '#ff3366' : '#fff';
        cardIcon.className = isAdding ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
};

window.shareProduct = async function() {
    // अगर प्रोडक्ट लोड नहीं हुआ है तो शेयर नहीं होगा
    if (!currentProduct) return;

    const pageUrl = window.location.href;
    const msgDiv = document.getElementById('action-msg');
    
    // Success मैसेज दिखाने का छोटा फंक्शन
    const showSuccess = () => {
        const shareBtn = document.querySelector('.fa-share-nodes');
        if (shareBtn) {
            shareBtn.className = 'fa-solid fa-check';
            setTimeout(() => { shareBtn.className = 'fa-solid fa-share-nodes'; }, 2000);
        }
        if (msgDiv) {
            msgDiv.innerText = '🔗 Masterpiece details copied/shared!';
            msgDiv.style.color = 'var(--luxury-blue)';
            setTimeout(() => { msgDiv.innerText = ''; msgDiv.style.color = 'var(--success)'; }, 3000);
        }
    };

    const showError = () => {
        if (msgDiv) {
            msgDiv.innerText = '❌ Failed to copy link';
            msgDiv.style.color = 'var(--danger)';
            setTimeout(() => { msgDiv.innerText = ''; }, 3000);
        }
    };

    // 🌟 शेयर करने के लिए प्रीमियम टेक्स्ट फॉर्मेट बनाएं (WhatsApp सपोर्ट के साथ)
    let shareText = `*SHHUTUP™ | ${currentProduct.collection || 'Exclusive Collection'}*\n`;
    shareText += `━━━━━━━━━━━━━━━━\n`;
    shareText += `⌚ *${currentProduct.name}*\n\n`;
    shareText += `💎 *Price:* ${formatINR(currentProduct.price)} `;
    
    if (currentProduct.mrp) {
        shareText += `(~${formatINR(currentProduct.mrp)}~)\n`;
    } else {
        shareText += `\n`;
    }

    if (currentProduct.discount) {
        shareText += `🏷️ *Discount:* ${currentProduct.discount}\n`;
    }

    if (currentProduct.description) {
        // डिस्क्रिप्शन को थोड़ा छोटा करके शेयर करें ताकि मैसेज ज्यादा बड़ा न हो
        const shortDesc = currentProduct.description.length > 150 
            ? currentProduct.description.substring(0, 150) + '...' 
            : currentProduct.description;
        shareText += `\n📝 *About:* ${shortDesc}\n`;
    }
    
    shareText += `━━━━━━━━━━━━━━━━\n`;
    shareText += `🛒 *View & Order Here:*\n`;

    // 1. कोशिश: Native Share (मोबाइल पर डायरेक्ट WhatsApp/Instagram शेयर का पॉपअप खोलेगा)
    if (navigator.share && window.isSecureContext) {
        try {
            await navigator.share({
                title: `SHHUTUP™ | ${currentProduct.name}`,
                text: shareText,
                url: pageUrl
            });
            return;
        } catch (err) {
            console.log('Share canceled', err);
        }
    } 

    // अगर शेयर API सपोर्ट नहीं करता है, तो क्लिपबोर्ड में पूरा टेक्स्ट और लिंक कॉपी कर लें
    const fullShareContent = shareText + pageUrl;

    // 2. कोशिश: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(fullShareContent);
            showSuccess();
            return;
        } catch (err) {
            console.error('Modern copy failed', err);
        }
    }

    // 3. पक्का जुगाड़ (Fallback): Localhost और पुराने ब्राउज़र के लिए
    try {
        const tempInput = document.createElement('textarea'); // <textarea> का इस्तेमाल ताकि लाइन ब्रेक (\n) सही से कॉपी हों
        tempInput.value = fullShareContent;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showSuccess();
    } catch (err) {
        console.error('All copy methods failed', err);
        showError();
    }
};




// ==========================================
// CART UI & DRAWER
// ==========================================
function setupCartUI() {
    const cartDrawer = document.getElementById('cart-drawer');
    const openBtn = document.getElementById('cart-toggle-btn');
    const closeBtn = document.getElementById('cart-close-btn');
    const overlay = document.getElementById('cart-overlay');

    const open = () => { cartDrawer.classList.add('active'); document.body.style.overflowY = 'hidden'; };
    const close = () => { cartDrawer.classList.remove('active'); document.body.style.overflowY = 'auto'; };

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
}

window.changeQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (document.getElementById('cart-count')) document.getElementById('cart-count').innerText = totalItems;
    if (document.getElementById('cart-items-count')) document.getElementById('cart-items-count').innerText = totalItems;

    if (!cartList) return;
    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart-message">Your luxury tray is empty.</div>';
        if (document.getElementById('cart-subtotal-price')) document.getElementById('cart-subtotal-price').innerText = '₹0';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-meta">
                    <span class="cart-item-price">${formatINR(item.price)}</span>
                    <div class="quantity-stepper">
                        <button onclick="changeQuantity(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
    if (document.getElementById('cart-subtotal-price')) {
        document.getElementById('cart-subtotal-price').innerText = formatINR(total);
    }
}

// ==========================================
// WISHLIST DRAWER
// ==========================================
function setupWishlistDrawer() {
    const drawer = document.getElementById('wishlist-drawer');
    const openBtn = document.getElementById('wishlist-toggle-btn');
    const closeBtn = document.getElementById('wishlist-close-btn');
    const overlay = document.getElementById('wishlist-overlay');

    const open = () => { updateWishlistUI(); drawer.classList.add('active'); document.body.style.overflowY = 'hidden'; };
    const close = () => { drawer.classList.remove('active'); document.body.style.overflowY = 'auto'; };

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
}

async function updateWishlistUI() {
    if (document.getElementById('wishlist-count')) document.getElementById('wishlist-count').innerText = wishlist.length;
    if (document.getElementById('wishlist-drawer-count')) document.getElementById('wishlist-drawer-count').innerText = wishlist.length;
    
    const wList = document.getElementById('wishlist-items-list');
    if (!wList) return;
    
    if (wishlist.length === 0) {
        wList.innerHTML = '<div class="empty-cart-message">Your luxury wishlist is empty.</div>';
        return;
    }
    
    wList.innerHTML = '<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-top:20px;"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading wishlist...</div>';
    
    try {
        const { db } = await initFirebase();
        const dbRef = ref(db);
        let htmlContent = '';
        
        for (let id of wishlist) {
            const snap = await get(child(dbRef, `products/${id}`));
            if (snap.exists()) {
                const product = snap.val();
                htmlContent += `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4 class="cart-item-name">${product.name}</h4>
                            <div class="cart-item-meta">
                                <span class="cart-item-price">${formatINR(product.price)}</span>
                                <div class="cart-item-actions" style="gap:8px;">
                                    <button onclick="moveWishlistToCartDetails('${id}')" style="background:var(--luxury-blue); color:#fff; border:none; padding:5px 12px; border-radius:6px; font-size:0.7rem; font-weight:bold; cursor:pointer; font-family:var(--font-product);">ADD TO CART</button>
                                    <button onclick="toggleWishlistDetails('${id}')" style="color:var(--danger); background:none; border:none; font-size:1.1rem; cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        wList.innerHTML = htmlContent;
    } catch (error) {
        console.error("Error loading wishlist items:", error);
        wList.innerHTML = '<div class="empty-cart-message" style="color:var(--danger);">Error loading wishlist.</div>';
    }
}

window.moveWishlistToCartDetails = async function(productId) {
    try {
        const { db } = await initFirebase();
        const dbRef = ref(db);
        const snap = await get(child(dbRef, `products/${productId}`));
        
        if (snap.exists()) {
            const product = { id: productId, ...snap.val() };
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ ...product, quantity: 1 });
            
            localStorage.setItem('shhutup_cart', JSON.stringify(cart));
            updateCartUI();
            toggleWishlistDetails(productId);
        }
    } catch (e) {
        console.error("Error moving to cart:", e);
    }
};

// ==========================================
// RECENTLY VIEWED
// ==========================================
function saveToRecentlyViewed(id) {
    let recent = JSON.parse(localStorage.getItem('shhutup_recent')) || [];
    recent = recent.filter(item => item !== id);
    recent.unshift(id);
    if (recent.length > 5) recent.pop(); 
    localStorage.setItem('shhutup_recent', JSON.stringify(recent));
}

async function loadRecentlyViewed(dbRef, currentId) {
    let recent = JSON.parse(localStorage.getItem('shhutup_recent')) || [];
    recent = recent.filter(id => id !== currentId).slice(0, 5); 

    if (recent.length === 0) return;

    document.getElementById('recent-section').style.display = 'block';
    const grid = document.getElementById('recent-grid');
    grid.innerHTML = '';

    for (let id of recent) {
        const snap = await get(child(dbRef, `products/${id}`));
        if (snap.exists()) {
            const p = snap.val();
            grid.innerHTML += `
                <div class="recent-card" onclick="window.location.href='product-details.html?id=${id}'">
                    <div class="recent-img-wrapper"><img src="${p.image}" alt="${p.name}"></div>
                    <div class="recent-info">
                        <h3 class="recent-title">${p.name}</h3>
                        <span class="recent-price">${formatINR(p.price)}</span>
                    </div>
                </div>
            `;
        }
    }
}

// ==========================================
// DISCOVER MORE (LAZY LOAD 2-COLUMN GRID)
// ==========================================
let allDiscoverProducts = [];
let displayedDiscoverCount = 0;
const LAZY_LOAD_LIMIT = 6;

async function fetchAllProductsForLazyLoad(dbRef) {
    try {
        const snapshot = await get(child(dbRef, 'products'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // 1. Array में बदलें और जो प्रोडक्ट खुला है उसे हटा दें
            allDiscoverProducts = Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .filter(p => p.id !== currentProduct.id);
            
            // 2. सबसे नए प्रोडक्ट्स को ऊपर रखने के लिए Sort करें
            allDiscoverProducts.sort((a, b) => b.timestamp - a.timestamp);
            
            // 3. Observer चालू करें और पहली 6 घड़ियां दिखाएं
            setupLazyLoadObserver();
            loadMoreDiscoverProducts();
        }
    } catch (error) {
        console.error("Error loading more products:", error);
    }
}

function loadMoreDiscoverProducts() {
    const grid = document.getElementById('more-products-grid');
    const loader = document.getElementById('lazy-loader');
    
    if (!grid || displayedDiscoverCount >= allDiscoverProducts.length) {
        if (loader) loader.style.display = 'none';
        return;
    }

    if (loader) loader.style.display = 'block';

    setTimeout(() => {
        const nextBatch = allDiscoverProducts.slice(displayedDiscoverCount, displayedDiscoverCount + LAZY_LOAD_LIMIT);
        let html = '';
        
        nextBatch.forEach(p => {
            const isWished = wishlist.includes(p.id);
            // Single Card Layout - Large, Premium, Single-Line Pricing
            html += `
                <div style="background: var(--card-bg, #161616); border: 1px solid var(--border-color, #2A2A2A); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
                    <a href="product-details.html?id=${p.id}" style="text-decoration: none; display: block;">
                        <div style="width: 100%; aspect-ratio: 4/4; background: #000; overflow: hidden;">
                            <img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="padding: 20px 20px 10px 20px;">
                            <span style="color: var(--luxury-blue, #1B4DFF); font-size: 0.85rem; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">${p.collection || 'COLLECTION'}</span>
                            <h3 style="color: #fff; font-size: 1.4rem; margin-bottom: 12px; font-family: var(--font-heading); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</h3>
                            
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: nowrap;">
                                <span style="color: #fff; font-size: 1.35rem; font-weight: bold;">${formatINR(p.price)}</span>
                                <span style="color: var(--text-muted, #A0A0A0); font-size: 0.95rem; text-decoration: line-through;">${formatINR(p.mrp)}</span>
                                ${p.discount ? `<span style="background: rgba(0, 200, 83, 0.15); color: var(--success, #00C853); font-size: 0.85rem; font-weight: bold; padding: 4px 8px; border-radius: 4px; white-space: nowrap;">${p.discount}</span>` : ''}
                            </div>
                        </div>
                    </a>
                    <div style="display: flex; gap: 15px; padding: 10px 20px 20px 20px;">
                        <button onclick="addToCartFromCard('${p.id}')" style="flex: 1; background: var(--luxury-blue); border: none; color: #fff; border-radius: 8px; padding: 14px; font-weight: bold; font-size: 0.95rem; cursor: pointer; transition: 0.3s; text-transform: uppercase;">ADD TO CART</button>
                        <button id="card-wish-btn-${p.id}" onclick="toggleWishlistDetails('${p.id}')" style="background: transparent; border: 1px solid var(--border-color); color: ${isWished ? '#ff3366' : '#fff'}; border-radius: 8px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; font-size: 1.2rem;">
                            <i id="card-wish-icon-${p.id}" class="${isWished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML += html;
        displayedDiscoverCount += nextBatch.length;
        
        if (displayedDiscoverCount >= allDiscoverProducts.length && loader) {
            loader.style.display = 'none';
        }
    }, 600);
}

// Discover More कार्ड्स से डायरेक्ट कार्ट में ऐड करने का फंक्शन
window.addToCartFromCard = function(productId) {
    const product = allDiscoverProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    
    localStorage.setItem('shhutup_cart', JSON.stringify(cart));
    updateCartUI();
    
    // कार्ट ड्रॉवर (Drawer) ओपन करें
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.add('active');
        document.body.style.overflowY = 'hidden';
    }
};

function setupLazyLoadObserver() {
    const loader = document.getElementById('lazy-loader');
    if (!loader) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayedDiscoverCount < allDiscoverProducts.length) {
            loadMoreDiscoverProducts();
        }
    }, { rootMargin: '0px 0px 300px 0px' });

    observer.observe(loader);
}


// ==========================================
// BACK TO TOP
// ==========================================


function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }, { passive: true });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupWhatsAppCheckout() {
    const checkoutBtn = document.getElementById('details-whatsapp-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        localStorage.removeItem('shhutup_applied_coupon'); // डायरेक्ट बाय में कूपन नहीं है
        window.location.href = 'checkout.html';
    });
}