/* ===== SHHUTUP - WhatsApp Integration ===== */

const WHATSAPP_NUMBER = '919999999999'; // Replace with actual WhatsApp number

function formatCartForWhatsApp() {
    if (!STATE.cart || STATE.cart.length === 0) return null;

    const couponEl = document.getElementById('coupon-code');
    const coupon = couponEl?.value?.trim() || '';

    let message = '🕐 *SHHUTUP™ Luxury Watches - New Order*\n\n';
    message += '━━━━━━━━━━━━━━━━━━━━━━━\n';
    message += '*ORDER DETAILS:*\n\n';

    STATE.cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.name}*\n`;
        message += `   Collection: ${item.collection}\n`;
        message += `   Qty: ${item.qty} × ₹${item.price.toLocaleString('en-IN')}\n`;
        message += `   Subtotal: ₹${(item.price * item.qty).toLocaleString('en-IN')}\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━━━━━━\n';
    message += `*Total Amount: ₹${STATE.getCartTotal().toLocaleString('en-IN')}*\n`;
    message += `🚚 *Shipping: FREE Priority Insured Delivery*\n`;

    if (coupon) {
        message += `🎟️ *Coupon Code: ${coupon}*\n`;
    }

    message += '\n━━━━━━━━━━━━━━━━━━━━━━━\n';
    message += 'Please confirm my order and share payment details. Thank you! 🙏';

    return message;
}

function openWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
}

function initWhatsAppCheckout() {
    // Main checkout button (cart drawer)
    const checkoutBtn = document.getElementById('whatsapp-checkout-btn');
    checkoutBtn?.addEventListener('click', () => {
        if (!STATE.cart || STATE.cart.length === 0) {
            showToastNotification('Your cart is empty!', 'dim');
            return;
        }
        const msg = formatCartForWhatsApp();
        if (msg) openWhatsApp(msg);
    });

    // Product details page checkout button
    const detailsBtn = document.getElementById('details-whatsapp-btn');
    detailsBtn?.addEventListener('click', () => {
        if (!STATE.cart || STATE.cart.length === 0) {
            showToastNotification('Add items to cart first!', 'dim');
            return;
        }
        const msg = formatCartForWhatsApp();
        if (msg) openWhatsApp(msg);
    });

    // Coupon
    const applyBtn = document.getElementById('apply-coupon');
    applyBtn?.addEventListener('click', () => {
        const input = document.getElementById('coupon-code');
        const code = input?.value?.trim().toUpperCase();
        if (!code) return;
        const validCoupons = { 'SHHUTUP10': 10, 'VIP20': 20, 'LUXURY15': 15 };
        if (validCoupons[code]) {
            showToastNotification(`Coupon ${code} applied! ${validCoupons[code]}% off`, 'blue');
        } else {
            showToastNotification('Invalid coupon code', 'dim');
        }
    });

    // Floating WhatsApp support button
    const floatingBtn = document.getElementById('floating-whatsapp');
    floatingBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = 'Hello SHHUTUP! I need help with my order / enquiry. 🕐';
        openWhatsApp(msg);
    });
}

document.addEventListener('DOMContentLoaded', initWhatsAppCheckout);
