/* 
   =========================================
   SHHUTUP™ — WHATSAPP CHECKOUT v2.0
   Formatted Order Message & Coupon Logic
   =========================================
*/

(function() {
    'use strict';

    // Firebase से आया नंबर इस्तेमाल करेंगे, अगर नहीं मिला तो डिफ़ॉल्ट नंबर
    const getWhatsAppNumber = () => localStorage.getItem('shhutup_wa_number') || '917903698180';

    // Coupon codes
    const VALID_COUPONS = {
        'VIP10': { discount: 10, type: 'percent', label: '10% OFF' },
        'SHHUTUP20': { discount: 20, type: 'percent', label: '20% OFF' },
        'FIRST500': { discount: 500, type: 'flat', label: '₹500 OFF' },
    };

    let appliedCoupon = null;

    // Format number in Indian system
    function formatINR(num) {
        const x = num.toString();
        let lastThree = x.substring(x.length - 3);
        const otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    }

    // Apply coupon
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon-code');

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();

            if (!code) return;

            if (VALID_COUPONS[code]) {
                appliedCoupon = { code, ...VALID_COUPONS[code] };
                applyCouponBtn.textContent = '✓ APPLIED';
                applyCouponBtn.style.background = 'var(--success)';
                applyCouponBtn.style.borderColor = 'var(--success)';
                applyCouponBtn.style.color = '#fff';
                couponInput.style.borderColor = 'var(--success)';
                couponInput.disabled = true;

                updateSubtotalWithCoupon();

                setTimeout(() => {
                    applyCouponBtn.textContent = appliedCoupon.label;
                }, 1500);
            } else {
                applyCouponBtn.textContent = 'INVALID';
                applyCouponBtn.style.background = 'var(--danger)';
                applyCouponBtn.style.borderColor = 'var(--danger)';
                applyCouponBtn.style.color = '#fff';
                couponInput.style.borderColor = 'var(--danger)';

                setTimeout(() => {
                    applyCouponBtn.textContent = 'APPLY';
                    applyCouponBtn.style.background = '';
                    applyCouponBtn.style.borderColor = '';
                    applyCouponBtn.style.color = '';
                    couponInput.style.borderColor = '';
                }, 2000);
            }
        });
    }

    function updateSubtotalWithCoupon() {
        const cart = JSON.parse(localStorage.getItem('shhutup_cart')) || [];
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (appliedCoupon) {
            if (appliedCoupon.type === 'percent') {
                total = total - (total * appliedCoupon.discount / 100);
            } else {
                total = Math.max(0, total - appliedCoupon.discount);
            }
        }

        const subtotalEl = document.getElementById('cart-subtotal-price');
        if (subtotalEl) {
            subtotalEl.textContent = formatINR(Math.round(total));
        }
    }

    // WhatsApp Checkout
        const checkoutBtn = document.getElementById('whatsapp-checkout-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('shhutup_cart')) || [];
            if (cart.length === 0) {
                checkoutBtn.style.animation = 'none';
                checkoutBtn.offsetHeight;
                checkoutBtn.style.animation = 'shake 0.5s ease';
                return;
            }
            // कूपन को सेव करें ताकि चेकआउट पेज पर इस्तेमाल हो सके
            localStorage.setItem('shhutup_applied_coupon', JSON.stringify(appliedCoupon));
            window.location.href = 'checkout.html';
        });
    }


     // Expose formatINR globally
    window.formatINR = formatINR;

     // 💡 फ्लोटिंग WhatsApp बटन को डायनामिक बनाना (Fixed Redirect)
    const floatingWaBtn = document.getElementById('floating-whatsapp');
    if (floatingWaBtn) {
        floatingWaBtn.addEventListener('click', function(e) {
            e.preventDefault(); // पुराने हार्डकोडेड लिंक को ब्लॉक करें
            const dynamicNumber = getWhatsAppNumber(); // एडमिन वाला लेटेस्ट नंबर लाएं
            const message = encodeURIComponent("Hello SHHUTUP Team, I have a query regarding the luxury collection.");
            window.open(`https://wa.me/${dynamicNumber}?text=${message}`, '_blank');
        });
    }

})();