/* ===== SHHUTUP - Landing Page Logic ===== */

// ===== PRODUCT DATA =====
const PRODUCTS = [
    {
        id: 1,
        name: 'Chronograph Blue Eclipse',
        collection: 'Blue Collection',
        price: 4999,
        originalPrice: 12999,
        image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600',
        badge: 'BESTSELLER',
        badgeClass: '',
        rating: 4.9,
        reviews: 128,
        discount: '61% OFF',
        description: 'Midnight blue dial with luminous hands, sapphire crystal glass, and 316L stainless steel case.'
    },
    {
        id: 2,
        name: 'Titan Gold Commander',
        collection: 'Premium Collection',
        price: 6499,
        originalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600',
        badge: 'PREMIUM',
        badgeClass: 'gold',
        rating: 4.8,
        reviews: 89,
        discount: '63% OFF',
        description: 'Gold-tone case with sunburst dial, Swiss movement, and genuine leather strap.'
    },
    {
        id: 3,
        name: 'Phantom Stealth Black',
        collection: 'Limited Edition',
        price: 7999,
        originalPrice: 22000,
        image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600',
        badge: 'LIMITED',
        badgeClass: 'limited',
        rating: 5.0,
        reviews: 43,
        discount: '63% OFF',
        description: 'All-black matte carbon dial with DLC-coated case. Only 500 pieces worldwide.'
    },
    {
        id: 4,
        name: 'Azure Diver Pro',
        collection: 'Blue Collection',
        price: 5499,
        originalPrice: 14500,
        image: 'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?auto=format&fit=crop&q=80&w=600',
        badge: 'NEW',
        badgeClass: '',
        rating: 4.7,
        reviews: 62,
        discount: '62% OFF',
        description: 'Deep-sea inspired design with rotating bezel, 200m water resistance, and superluminova markers.'
    },
    {
        id: 5,
        name: 'Royale Gold Skeleton',
        collection: 'Premium Collection',
        price: 8999,
        originalPrice: 25000,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
        badge: 'EXCLUSIVE',
        badgeClass: 'gold',
        rating: 4.9,
        reviews: 35,
        discount: '64% OFF',
        description: 'Open-heart skeleton dial revealing the intricate Swiss mechanical movement inside.'
    },
    {
        id: 6,
        name: 'Void Black Minimalist',
        collection: 'Limited Edition',
        price: 3999,
        originalPrice: 9999,
        image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600',
        badge: 'LIMITED',
        badgeClass: 'limited',
        rating: 4.8,
        reviews: 57,
        discount: '60% OFF',
        description: 'Ultra-minimalist design with no numerals, just pure clean geometry and elegance.'
    }
];

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preload-counter');
    const bar = document.getElementById('preload-bar');

    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 400);
        }
        if (counter) counter.textContent = `${Math.floor(progress)}%`;
        if (bar) bar.style.width = `${progress}%`;
    }, 80);

    document.body.style.overflow = 'hidden';

    window.addEventListener('load', () => {
        progress = 100;
        if (counter) counter.textContent = '100%';
        if (bar) bar.style.width = '100%';
        clearInterval(interval);
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 600);
    });
}

// ===== MOUSE GLOW =====
function initMouseGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow) return;
    document.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }, { passive: true });
}

// ===== LIVE VISITOR COUNTER =====
function initLiveCounter() {
    const el = document.getElementById('live-visitors');
    if (!el) return;
    let base = 38 + Math.floor(Math.random() * 20);
    el.textContent = base;
    setInterval(() => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        base = Math.max(20, Math.min(100, base + delta));
        el.textContent = base;
    }, 3500);
}

// ===== SOCIAL PROOF TOAST =====
function initSocialProofToast() {
    const toast = document.getElementById('recent-order-toast');
    const productName = document.getElementById('toast-product-name');
    if (!toast) return;

    const orders = [
        { name: 'Chronograph Blue Eclipse', location: 'Mumbai' },
        { name: 'Titan Gold Commander', location: 'Delhi' },
        { name: 'Phantom Stealth Black', location: 'Bangalore' },
        { name: 'Azure Diver Pro', location: 'Hyderabad' },
        { name: 'Royale Gold Skeleton', location: 'Chennai' },
        { name: 'Void Black Minimalist', location: 'Pune' }
    ];

    const times = ['2 minutes ago', '5 minutes ago', 'just now', '8 minutes ago'];

    let idx = 0;
    function showToast() {
        const order = orders[idx % orders.length];
        const time = times[Math.floor(Math.random() * times.length)];
        if (productName) productName.textContent = order.name;
        const timeEl = toast.querySelector('.toast-time');
        if (timeEl) timeEl.textContent = `${time} from ${order.location}`;
        toast.classList.add('show');
        idx++;
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    setTimeout(() => {
        showToast();
        setInterval(showToast, 12000);
    }, 3000);
}

// ===== PRODUCT GRID =====
function renderProductCard(product) {
    const inWishlist = STATE.isInWishlist(product.id);
    return `
        <div class="product-card" data-id="${product.id}" data-collection="${product.collection}">
            <div class="product-card-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'">
                ${product.badge ? `<span class="product-badge ${product.badgeClass}">${product.badge}</span>` : ''}
                <button class="product-wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="Wishlist">
                    <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="product-card-body">
                <div class="product-collection">${product.collection}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-stars">
                    ${'★'.repeat(Math.floor(product.rating))}${ product.rating % 1 ? '½' : '' }
                    <span style="color:var(--text-dim);margin-left:4px;">(${product.reviews})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                    <span class="product-price-old">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    <span class="product-discount">${product.discount}</span>
                </div>
                <div class="product-card-actions">
                    <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="btn-view-details" data-id="${product.id}">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function initProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    function renderGrid(products) {
        grid.innerHTML = products.length
            ? products.map(renderProductCard).join('')
            : '<p style="color:var(--text-dim);text-align:center;padding:3rem;grid-column:1/-1;">No products found in this collection.</p>';
        bindProductEvents();
    }

    renderGrid(PRODUCTS);

    // Tab filtering
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;
            const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.collection === filter);
            renderGrid(filtered);
        });
    });
}

function bindProductEvents() {
    // Add to cart
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = PRODUCTS.find(p => p.id === id);
            if (product) STATE.addToCart(product);
        });
    });

    // View details
    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            window.location.href = `product-details.html?id=${id}`;
        });
    });

    // Card click to details
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-cart') || e.target.closest('.product-wishlist-btn') || e.target.closest('.btn-view-details')) return;
            const id = card.dataset.id;
            window.location.href = `product-details.html?id=${id}`;
        });
    });

    // Wishlist toggle
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = PRODUCTS.find(p => p.id === id);
            if (!product) return;
            const added = STATE.toggleWishlist(product);
            btn.classList.toggle('active', added);
            btn.innerHTML = `<i class="fa-${added ? 'solid' : 'regular'} fa-heart"></i>`;
        });
    });

    // Vanilla Tilt (if loaded)
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll('.product-card'), {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.1
        });
    }
}

// ===== FAQ =====
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        question?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            items.forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ===== NEWSLETTER =====
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value;
        if (email) {
            showToastNotification('Welcome to the Inner Circle! 🎉', 'blue');
            form.reset();
        }
    });
}

// ===== HERO WATCH EFFECT =====
function initHeroEffect() {
    const wrapper = document.getElementById('hero-watch-wrapper');
    if (!wrapper) return;
    document.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        const rx = ((e.clientY / innerHeight) - 0.5) * 8;
        const ry = ((e.clientX / innerWidth) - 0.5) * 12;
        wrapper.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }, { passive: true });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initMouseGlow();
    initLiveCounter();
    initSocialProofToast();
    initProductGrid();
    initFAQ();
    initNewsletter();
    initHeroEffect();
});

// Export products for use in other pages
window.SHHUTUP_PRODUCTS = PRODUCTS;
