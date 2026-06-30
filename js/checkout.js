/* =========================================
   SHHUTUP™ — CHECKOUT & INDIA POST API LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const pinInput = document.getElementById('c-pincode');
    const cityInput = document.getElementById('c-city');
    const stateInput = document.getElementById('c-state');
    const countryInput = document.getElementById('c-country');
    const pinLoader = document.getElementById('pin-loader');
    const pinMsg = document.getElementById('pin-msg');
    const form = document.getElementById('checkout-form');

    // Format INR Function
    const formatINR = (num) => {
        const x = num.toString();
        let lastThree = x.substring(x.length - 3);
        const otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') lastThree = ',' + lastThree;
        return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    };

    // India Post PIN Code API Logic
    pinInput.addEventListener('input', async (e) => {
        const pin = e.target.value.trim();
        
        if (pin.length === 6) {
            pinLoader.style.display = 'block';
            pinMsg.textContent = 'Fetching details...';
            pinMsg.className = 'api-status text-muted';

            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await response.json();

                if (data && data[0].Status === "Success") {
                    const details = data[0].PostOffice[0];
                    cityInput.value = details.District;
                    stateInput.value = details.State;
                    countryInput.value = details.Country;
                    
                    pinMsg.textContent = '✓ Location found';
                    pinMsg.className = 'api-status text-success';
                } else {
                    throw new Error("Invalid PIN");
                }
            } catch (error) {
                pinMsg.textContent = '⚠️ Could not auto-detect. Please fill manually.';
                pinMsg.className = 'api-status text-danger';
                cityInput.value = '';
                stateInput.value = '';
            } finally {
                pinLoader.style.display = 'none';
            }
        } else {
            pinMsg.textContent = '';
        }
    });

    // Handle Form Submit & Send to WhatsApp
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem('shhutup_cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            window.location.href = 'index.html';
            return;
        }

        // Get Address Details
        const name = document.getElementById('c-name').value.trim();
        const pin = pinInput.value.trim();
        const city = cityInput.value.trim();
        const state = stateInput.value.trim();
        const address = document.getElementById('c-address').value.trim();
        const savedEmail = localStorage.getItem('shhutup_user_email');
        const appliedCoupon = JSON.parse(localStorage.getItem('shhutup_applied_coupon'));

        // Build WhatsApp Message
        let total = 0;
        let message = `🏷️ *SHHUTUP™ — New Order*\n━━━━━━━━━━━━━━━━\n\n`;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} × ${formatINR(item.price)} = ${formatINR(itemTotal)}\n\n`;
        });

        message += `━━━━━━━━━━━━━━━━\n`;
        message += `💰 *Subtotal:* ${formatINR(total)}\n`;

        if (appliedCoupon) {
            let discount = appliedCoupon.type === 'percent' ? Math.round(total * appliedCoupon.discount / 100) : appliedCoupon.discount;
            message += `🎟️ *Coupon (${appliedCoupon.code}):* -${formatINR(discount)}\n`;
            total = Math.max(0, total - discount);
            message += `💎 *Final Total:* ${formatINR(total)}\n`;
        }

        message += `🚚 *Shipping:* FREE\n`;
        message += `━━━━━━━━━━━━━━━━\n\n`;
        
        // Append Shipping Details
        message += `📦 *SHIPPING DETAILS:*\n`;
        message += `👤 *Name:* ${name}\n`;
        if (savedEmail) message += `📧 *Email:* ${savedEmail}\n`;
        message += `🏠 *Address:* ${address}\n`;
        message += `🌆 *City/State:* ${city}, ${state}\n`;
        message += `📍 *PIN Code:* ${pin}\n`;

        const dynamicNumber = localStorage.getItem('shhutup_wa_number') || '917903698180';
        const encodedMessage = encodeURIComponent(message);
        
        // Clear Cart after redirecting to WA (Optional, remove if you want to keep cart)
        // localStorage.removeItem('shhutup_cart'); 

        window.open(`https://wa.me/${dynamicNumber}?text=${encodedMessage}`, '_self');
    });
});
