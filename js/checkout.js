import { formatCurrency, showToast, clearCart, getCartItems } from './cart.js';
import { products, updateProductStock, updateProductSold } from './products.js';
import { getCurrentUser } from './auth.js';
import { earnPoints } from './loyalty.js';

const SHIPPING_FEES = {
    inner: { label: 'Nội thành Hà Nội', fee: 20000 },
    outer: { label: 'Ngoại thành Hà Nội', fee: 40000 },
    other: { label: 'Tỉnh/thành khác', fee: 60000 }
};

const getLiveProducts = () => {
    try { return JSON.parse(localStorage.getItem('bookly_products_v8')) || products; }
    catch { return products; }
};

const validateCartStock = (cartItems) => {
    const liveProducts = getLiveProducts();
    const requiredByBook = new Map();

    const addRequired = (id, title, quantity) => {
        const bookId = Number(id);
        if (!bookId) return;
        const current = requiredByBook.get(bookId) || { id: bookId, title, quantity: 0 };
        current.quantity += Math.max(1, Number(quantity || 1));
        if (!current.title) current.title = title;
        requiredByBook.set(bookId, current);
    };

    cartItems.forEach(item => {
        if (item.isCombo && Array.isArray(item.comboBookIds)) {
            item.comboBookIds.forEach(bookId => {
                const comboBook = item.comboBooks?.find(b => Number(b.id) === Number(bookId));
                addRequired(bookId, comboBook?.title || item.title, item.quantity);
            });
            return;
        }
        addRequired(item.id, item.title, item.quantity);
    });

    for (const needed of requiredByBook.values()) {
        const product = liveProducts.find(p => Number(p.id) === Number(needed.id));
        const stock = Number(product?.stock || 0);
        const title = product?.title || needed.title;

        if (!product || stock <= 0) {
            showToast(`Sách "${title}" hiện đã hết hàng`, 'error');
            return false;
        }

        if (stock < needed.quantity) {
            showToast('Số lượng sách hiện không đủ vui lòng giảm số lượng', 'error');
            return false;
        }
    }

    return true;
};


export const renderCheckoutPage = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html?redirect=checkout.html';
        return;
    }

    let cart = getCartItems();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const itemsList = document.getElementById('co-items-list');
    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div style="display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed var(--color-border);">
                <img src="${item.cover}" style="width: 50px; height: 75px; object-fit: cover; border-radius: 4px;" alt="${item.title}">
                <div style="flex: 1;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 5px;">${item.title}</h4>
                    ${item.isCombo && Array.isArray(item.comboBooks) ? `<div style="font-size:0.82rem;color:#777;line-height:1.6;margin-bottom:6px;">${item.comboBooks.map(book => `• ${book.title} x ${item.quantity}`).join('<br>')}</div>` : ''}
                    ${item.originalPrice && item.originalPrice > item.price ? `<div style="font-size:0.8rem;color:#888;"><span style="text-decoration:line-through;">${formatCurrency(item.originalPrice * item.quantity)}</span> <span style="color:var(--color-danger);font-weight:700;">-${item.discountPct || 0}%</span></div>` : ''}
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #666;">
                        <span>Số lượng: ${item.quantity}</span>
                        <span style="font-weight: 600; color: var(--color-text);">${formatCurrency(itemTotal)}</span>
                    </div>
                </div>
            </div>
        `;
    });

    const locationSelect = document.getElementById('co-location');
    const shippingEl = document.getElementById('co-shipping');
    const subtotalEl = document.getElementById('co-subtotal');
    const totalEl = document.getElementById('co-total');

    const updateCheckoutTotal = () => {
        const selectedLocation = locationSelect?.value || 'inner';
        const shippingInfo = SHIPPING_FEES[selectedLocation] || SHIPPING_FEES.inner;
        const grandTotal = total + shippingInfo.fee;

        if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
        if (shippingEl) shippingEl.textContent = formatCurrency(shippingInfo.fee);
        if (totalEl) totalEl.textContent = formatCurrency(grandTotal);

        window.currentCheckoutGrandTotal = grandTotal;
        window.currentCheckoutShippingFee = shippingInfo.fee;
        window.currentCheckoutShippingLabel = shippingInfo.label;
    };

    if (itemsList) {
        itemsList.innerHTML = html;
        updateCheckoutTotal();
    }

    if (locationSelect) {
        locationSelect.addEventListener('change', updateCheckoutTotal);
    }

    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const qrSection = document.getElementById('qr-section');
    
    if (paymentRadios.length > 0 && qrSection) {
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'transfer') {
                    qrSection.classList.add('active');
                } else {
                    qrSection.classList.remove('active');
                }
            });
        });
    }

    // Handle form submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateCartStock(cart)) {
                return;
            }

            // Update stock & sold count
            updateProductStock(cart);
            updateProductSold(cart);

            const getOrderHistoryKey = () => {
                return currentUser?.id ? `bookly_order_history_user_${currentUser.id}` : 'bookly_order_history_guest';
            };

            // Save order to localStorage history
            const orders = JSON.parse(localStorage.getItem(getOrderHistoryKey())) || [];
            
            // Use grandTotal if available, else fallback to items total
            const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const totalOrder = window.currentCheckoutGrandTotal || itemsTotal;
            
            const newOrder = {
                id: 'ORD-' + Date.now(),
                date: new Date().toLocaleDateString('vi-VN'),
                items: cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    cover: item.cover,
                    author: item.author,
                    price: item.price,
                    originalPrice: item.originalPrice || item.price,
                    salePrice: item.salePrice || item.price,
                    discountPct: item.discountPct || 0,
                    saleSource: item.saleSource || '',
                    isCombo: Boolean(item.isCombo),
                    comboBookIds: item.comboBookIds || [],
                    comboBooks: item.comboBooks || [],
                    cartKey: item.cartKey || item.id,
                    quantity: item.quantity
                })),
                subtotal: itemsTotal,
                shippingFee: window.currentCheckoutShippingFee || 20000,
                shippingArea: window.currentCheckoutShippingLabel || 'Nội thành Hà Nội',
                total: totalOrder,
                status: 'Đã đặt'
            };
            orders.unshift(newOrder);
            localStorage.setItem(getOrderHistoryKey(), JSON.stringify(orders));

            // Earn Loyalty Points (F5)
            earnPoints(totalOrder, newOrder.id);

            // Show success
            showToast('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.', 'success');

            // Clear cart
            clearCart();

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 2500);
        });
    }
};
