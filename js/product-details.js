/* ===== SHHUTUP - Product Details Page ===== */

// ===== PRODUCT DATA (mirrored from landing.js) =====
const ALL_PRODUCTS = [
    {
        id: 1,
        name: 'Chronograph Blue Eclipse',
        collection: 'Blue Collection',
        price: 4999,
        originalPrice: 12999,
        images: [
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'BESTSELLER',
        rating: 4.9,
        reviews: 128,
        discount: '61% OFF',
        description: 'The Chronograph Blue Eclipse is a statement of oceanic luxury. Featuring a mesmerizing midnight blue dial with multi-layered depth, luminous Super-LumiNova hands and indices, and a sapphire crystal glass that resists scratches with unyielding elegance. The precision 316L stainless steel case is engineered to last decades.',
        specs: {
            'Case Material': '316L Stainless Steel',
            'Dial Color': 'Midnight Blue',
            'Crystal': 'Sapphire Crystal',
            'Water Resistance': '50 Meters',
            'Movement': 'Japanese Quartz',
            'Case Diameter': '42mm',
            'Strap': 'Genuine Leather / Steel',
            'Warranty': '1 Year International'
        }
    },
    {
        id: 2,
        name: 'Titan Gold Commander',
        collection: 'Premium Collection',
        price: 6499,
        originalPrice: 18000,
        images: [
            'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'PREMIUM',
        rating: 4.8,
        reviews: 89,
        discount: '63% OFF',
        description: 'The Titan Gold Commander is the ultimate power watch for the modern executive. PVD gold-tone case with a radiant sunburst champagne dial. Powered by a Swiss-grade precision movement with outstanding accuracy. Paired with a hand-stitched genuine Italian leather strap.',
        specs: {
            'Case Material': 'PVD Gold-Tone Steel',
            'Dial Color': 'Champagne Sunburst',
            'Crystal': 'Mineral Crystal',
            'Water Resistance': '30 Meters',
            'Movement': 'Swiss Quartz',
            'Case Diameter': '40mm',
            'Strap': 'Italian Leather',
            'Warranty': '1 Year International'
        }
    },
    {
        id: 3,
        name: 'Phantom Stealth Black',
        collection: 'Limited Edition',
        price: 7999,
        originalPrice: 22000,
        images: [
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'LIMITED',
        rating: 5.0,
        reviews: 43,
        discount: '63% OFF',
        description: 'The Phantom Stealth Black is the most coveted piece in the SHHUTUP collection. Entirely blacked out with DLC (Diamond-Like Carbon) coating on the case, bracelet, and crown. All-black matte carbon fiber dial with stealth-mode indices. Only 500 pieces worldwide. Never on sale again.',
        specs: {
            'Case Material': 'DLC Carbon-Coated Steel',
            'Dial Color': 'Matte Carbon Black',
            'Crystal': 'Sapphire Crystal',
            'Water Resistance': '100 Meters',
            'Movement': 'Swiss Automatic',
            'Case Diameter': '44mm',
            'Strap': 'Black Rubber + Steel',
            'Edition': 'Limited 500 Pieces'
        }
    },
    {
        id: 4,
        name: 'Azure Diver Pro',
        collection: 'Blue Collection',
        price: 5499,
        originalPrice: 14500,
        images: [
            'https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'NEW',
        rating: 4.7,
        reviews: 62,
        discount: '62% OFF',
        description: 'Born from the depths of the ocean. The Azure Diver Pro features a unidirectional rotating bezel, 200m water resistance, and Super-LumiNova markers visible up to 8 hours underwater. Inspired by professional dive watches, designed for everyday luxury.',
        specs: {
            'Case Material': '316L Stainless Steel',
            'Dial Color': 'Ocean Blue',
            'Crystal': 'Sapphire Crystal',
            'Water Resistance': '200 Meters',
            'Movement': 'Japanese Automatic',
            'Case Diameter': '43mm',
            'Strap': 'Rubber + Steel Bracelet',
            'Bezel': 'Unidirectional Rotating'
        }
    },
    {
        id: 5,
        name: 'Royale Gold Skeleton',
        collection: 'Premium Collection',
        price: 8999,
        originalPrice: 25000,
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'EXCLUSIVE',
        rating: 4.9,
        reviews: 35,
        discount: '64% OFF',
        description: 'A horological masterpiece of openwork design. The Royale Gold Skeleton reveals the intricate Swiss mechanical movement through its sculpted open-heart dial. Gold bridges, polished surfaces, and beveled edges are finished by master craftsmen. The pinnacle of SHHUTUP watchmaking.',
        specs: {
            'Case Material': 'Gold PVD Stainless Steel',
            'Dial': 'Open Skeleton / No Dial',
            'Crystal': 'Sapphire Crystal (AR Coated)',
            'Water Resistance': '50 Meters',
            'Movement': 'Swiss Mechanical Skeleton',
            'Case Diameter': '41mm',
            'Strap': 'Calfskin Leather',
            'Finishing': 'Hand-polished Bevels'
        }
    },
    {
        id: 6,
        name: 'Void Black Minimalist',
        collection: 'Limited Edition',
        price: 3999,
        originalPrice: 9999,
        images: [
            'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
        ],
        badge: 'LIMITED',
        rating: 4.8,
        reviews: 57,
        discount: '60% OFF',
        description: 'Less is more. The Void Black Minimalist strips away everything non-essential — no numerals, no clutter, just a perfect flat black dial with two refined markers at 12 and 6. Architectural simplicity elevated to art. For those who understand that true luxury needs no decoration.',
        specs: {
            'Case Material': '316L Brushed Steel',
            'Dial Color': 'Flat Black',
            'Crystal': 'Hardlex Crystal',
            'Water Resistance': '50 Meters',
            'Movement': 'Japanese Quartz',
            'Case Diameter': '38mm',
            'Strap': 'Black Nylon / Leather',
            'Style': 'Ultra-Minimalist'
        }
    }
];

// ===== RECENTLY VIEWED =====
function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem('shhutup_recent') || '[]');
}

function addToRecentlyViewed(productId) {
    let recent = getRecentlyViewed();
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    recent = recent.slice(0, 6);
    localStorage.setItem('shhutup_recent', JSON.stringify(recent));
}

// ===== RENDER PRODUCT DETAILS =====
function renderProductDetails(product) {
    const container = document.getElementById('details-container');
    if (!container) return;

    const specsHTML = Object.entries(product.specs || {}).map(([label, value]) => `
        <div class="spec-item">
            <div class="spec-label">${label}</div>
            <div class="spec-value">${value}</div>
        </div>
    `).join('');

    const slidesHTML = (product.images || [product.image]).map(img => `
        <div class="swiper-slide">
            <img src="${img}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'">
        </div>
    `).join('');

    container.innerHTML = `
        <div class="product-details-grid">
            <div class="product-gallery">
                <div class="swiper product-swiper">
                    <div class="swiper-wrapper">${slidesHTML}</div>
                    <div class="swiper-pagination"></div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
            <div class="product-detail-info">
                <div class="detail-collection">${product.collection}</div>
                <h1 class="detail-name">${product.name}</h1>
                <div class="detail-rating">
                    <span style="color:#f5c518">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</span>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="detail-price-row">
                    <span class="detail-price">₹${product.price.toLocaleString('en-IN')}</span>
                    <span class="detail-old-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                    <span class="detail-discount">${product.discount}</span>
                </div>
                <p class="detail-description">${product.description}</p>
                ${product.badge === 'LIMITED' ? '<p style="font-size:0.8rem;color:#ff8c42;font-family:var(--font-accent);font-weight:700;letter-spacing:0.1em;">⚠️ LIMITED STOCK — ORDER NOW</p>' : ''}
                <div class="detail-specs">${specsHTML}</div>
                <div class="detail-actions">
                    <button class="detail-add-cart" id="detail-add-cart-btn">
                        <i class="fa-solid fa-bag-shopping"></i> ADD TO CART
                    </button>
                    <button class="detail-whatsapp" id="detail-buy-now-btn">
                        <i class="fa-brands fa-whatsapp"></i> BUY NOW ON WHATSAPP
                    </button>
                </div>
                <div style="display:flex;gap:1rem;margin-top:0.5rem;font-size:0.8rem;color:var(--text-dim);">
                    <span><i class="fa-solid fa-truck" style="color:var(--luxury-blue);margin-right:4px;"></i>Free Priority Shipping</span>
                    <span><i class="fa-solid fa-shield" style="color:var(--luxury-blue);margin-right:4px;"></i>1 Year Warranty</span>
                    <span><i class="fa-solid fa-rotate-left" style="color:var(--luxury-blue);margin-right:4px;"></i>7-Day Returns</span>
                </div>
            </div>
        </div>
    `;

    // Init Swiper
    if (window.Swiper) {
        new Swiper('.product-swiper', {
            loop: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        });
    }

    // Add to cart button
    document.getElementById('detail-add-cart-btn')?.addEventListener('click', () => {
        STATE.addToCart({
            id: product.id,
            name: product.name,
            collection: product.collection,
            price: product.price,
            image: product.images ? product.images[0] : product.image
        });
    });

    // Buy now on WhatsApp (direct single product)
    document.getElementById('detail-buy-now-btn')?.addEventListener('click', () => {
        const msg = `🕐 *SHHUTUP™ Luxury Watches - Buy Now*\n\n` +
            `*Product:* ${product.name}\n` +
            `*Collection:* ${product.collection}\n` +
            `*Price:* ₹${product.price.toLocaleString('en-IN')}\n` +
            `*Discount:* ${product.discount}\n\n` +
            `🚚 *Free Priority Insured Shipping*\n` +
            `🛡️ *1 Year Warranty Included*\n\n` +
            `Please confirm my order. Thank you! 🙏`;
        window.open(`https://wa.me/919999999999?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

// ===== RENDER MINI CARDS =====
function renderMiniCard(product) {
    return `
        <div class="mini-product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
            <img src="${product.images ? product.images[0] : product.image}" alt="${product.name}"
                onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'">
            <div class="mini-product-card-info">
                <div class="mini-product-name">${product.name}</div>
                <div class="mini-product-price">₹${product.price.toLocaleString('en-IN')}</div>
            </div>
        </div>
    `;
}

// ===== RECENTLY VIEWED SECTION =====
function renderRecentlyViewed(currentId) {
    const recent = getRecentlyViewed().filter(id => id !== currentId);
    const recentSection = document.getElementById('recent-section');
    const recentGrid = document.getElementById('recent-grid');
    if (!recentGrid || !recent.length) return;

    const products = recent.map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean);
    if (!products.length) return;

    recentGrid.innerHTML = products.map(renderMiniCard).join('');
    if (recentSection) recentSection.style.display = 'block';
}

// ===== MORE PRODUCTS =====
function renderMoreProducts(currentId) {
    const grid = document.getElementById('more-products-grid');
    if (!grid) return;
    const others = ALL_PRODUCTS.filter(p => p.id !== currentId);
    grid.innerHTML = others.map(renderMiniCard).join('');
}

// ===== MAIN INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id') || '1');

    const product = ALL_PRODUCTS.find(p => p.id === productId) || ALL_PRODUCTS[0];

    // Update page title
    document.title = `SHHUTUP™ | ${product.name}`;

    // Track view
    addToRecentlyViewed(product.id);

    // Render
    renderProductDetails(product);
    renderRecentlyViewed(product.id);
    renderMoreProducts(product.id);
});
