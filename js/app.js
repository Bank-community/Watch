/* ===== SHHUTUP - Core App Logic (Shared across pages) ===== */

// ===== STATE MANAGEMENT =====
const STATE = {
    cart: JSON.parse(localStorage.getItem('shhutup_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('shhutup_wishlist') || '[]'),

    saveCart() {
        localStorage.setItem('shhutup_cart', JSON.stringify(this.cart));
    },
    saveWishlist() {
        localStorage.setItem('shhutup_wishlist', JSON.stringify(this.wishlist));
    },

    addToCart(product) {
        const existing = this.cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({ ...product, qty: 1 });
        }
        this.saveCart();
        updateCartUI();
        showToastNotification(`${product.name} added to cart!`, 'blue');
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveCart();
        updateCartUI();
    },

    updateQty(productId, delta) {
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;
        item.qty = Math.max(1, item.qty + delta);
        this.saveCart();
        updateCartUI();
    },

    toggleWishlist(product) {
        const idx = this.wishlist.findIndex(i => i.id === product.id);
        if (idx > -1) {
            this.wishlist.splice(idx, 1);
            showToastNotification(`Removed from wishlist`, 'dim');
        } else {
            this.wishlist.push(product);
            showToastNotification(`${product.name} added to wishlist!`, 'blue');
        }
        this.saveWishlist();
        updateWishlistUI();
        return idx === -1;
    },

    isInWishlist(productId) {
        return this.wishlist.some(i => i.id === productId);
    },

    getCartTotal() {
        return this.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    },

    getCartCount() {
        return this.cart.reduce((sum, i) => sum + i.qty, 0);
    }
};

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length && navLinks.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(s => observer.observe(s));
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    menu.querySelectorAll('[data-menu-link]').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            menu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== SEARCH =====
function initSearch() {
    const toggleBtn = document.getElementById('search-toggle-btn');
    const overlay = document.getElementById('search-overlay');
    const closeBtn = document.getElementById('search-close');
    if (!toggleBtn || !overlay) return;

    toggleBtn.addEventListener('click', () => {
        overlay.classList.toggle('active');
        if (overlay.classList.contains('active')) {
            document.getElementById('search-input')?.focus();
        }
    });
    closeBtn?.addEventListener('click', () => overlay.classList.remove('active'));
}

// ===== CART UI =====
function updateCartUI() {
    const count = STATE.getCartCount();
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    document.querySelectorAll('#cart-items-count').forEach(el => el.textContent = count);

    const total = STATE.getCartTotal();
    document.querySelectorAll('#cart-subtotal-price').forEach(el => {
        el.textContent = `₹${total.toLocaleString('en-IN')}`;
    });

    const listEls = document.querySelectorAll('#cart-items-list');
    listEls.forEach(listEl => {
        if (STATE.cart.length === 0) {
            listEl.innerHTML = '<div class="empty-cart-message">Your luxury tray is empty.</div>';
        } else {
            listEl.innerHTML = STATE.cart.map(item => `
                <div class="cart-item">
                    <img class="cart-item-image" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="STATE.updateQty(${item.id}, -1)">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" onclick="STATE.updateQty(${item.id}, 1)">+</button>
                            <button class="cart-item-remove" onclick="STATE.removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    });
}

// ===== WISHLIST UI =====
function updateWishlistUI() {
    const count = STATE.wishlist.length;
    document.querySelectorAll('#wishlist-count').forEach(el => el.textContent = count);
    document.querySelectorAll('#wishlist-drawer-count').forEach(el => el.textContent = count);

    const listEls = document.querySelectorAll('#wishlist-items-list');
    listEls.forEach(listEl => {
        if (STATE.wishlist.length === 0) {
            listEl.innerHTML = '<div class="empty-cart-message">Your wishlist is empty.</div>';
        } else {
            listEl.innerHTML = STATE.wishlist.map(item => `
                <div class="cart-item">
                    <img class="cart-item-image" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="STATE.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">Add to Cart</button>
                            <button class="cart-item-remove" onclick="STATE.toggleWishlist(${JSON.stringify(item).replace(/"/g, '&quot;')}); updateWishlistUI();"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    });
}

// ===== DRAWERS =====
function initDrawers() {
    // Cart drawer
    const cartToggle = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartClose = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');

    cartToggle?.addEventListener('click', () => cartDrawer?.classList.add('open'));
    cartClose?.addEventListener('click', () => cartDrawer?.classList.remove('open'));
    cartOverlay?.addEventListener('click', () => cartDrawer?.classList.remove('open'));

    // Wishlist drawer
    const wishlistToggle = document.getElementById('wishlist-toggle-btn');
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistClose = document.getElementById('wishlist-close-btn');
    const wishlistOverlay = document.getElementById('wishlist-overlay');

    wishlistToggle?.addEventListener('click', () => wishlistDrawer?.classList.add('open'));
    wishlistClose?.addEventListener('click', () => wishlistDrawer?.classList.remove('open'));
    wishlistOverlay?.addEventListener('click', () => wishlistDrawer?.classList.remove('open'));
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== REVEAL ANIMATIONS =====
function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
}

// ===== TOAST NOTIFICATION =====
function showToastNotification(message, type = 'blue') {
    const existing = document.getElementById('app-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: var(--bg-elevated); border: 1px solid var(--border-light);
        border-left: 3px solid ${type === 'blue' ? 'var(--luxury-blue)' : 'var(--text-dim)'};
        border-radius: 8px; padding: 14px 20px;
        font-family: var(--font-ui); font-size: 0.85rem; color: var(--text-primary);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;

    const style = document.createElement('style');
    style.textContent = '@keyframes slideInRight { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initSearch();
    initDrawers();
    initBackToTop();
    initReveal();
    updateCartUI();
    updateWishlistUI();
});
