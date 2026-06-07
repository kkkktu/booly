// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Toast notification
export const showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '<i class="ph ph-check-circle" style="color: var(--color-secondary); font-size: 1.5rem;"></i>',
        info: '<i class="ph ph-info" style="color: var(--color-primary); font-size: 1.5rem;"></i>',
        error: '<i class="ph ph-warning-circle" style="color: var(--color-danger); font-size: 1.5rem;"></i>'
    };

    toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (container.contains(toast)) toast.remove();
    }, 3000);
};

const getStorageUser = () => {
    try { return JSON.parse(localStorage.getItem('bookly_currentUser')); }
    catch { return null; }
};

const getUserScope = () => {
    const user = getStorageUser();
    return user?.id ? `user_${user.id}` : 'guest';
};

export const getCurrentCartKey = () => `bookly_cart_${getUserScope()}`;
export const getCurrentWishlistKey = () => `bookly_wishlist_${getUserScope()}`;

const parseStorageArray = (key) => {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const loadScopedArray = (currentKey, legacyKey) => {
    const scopedRaw = localStorage.getItem(currentKey);
    if (scopedRaw) return parseStorageArray(currentKey);

    const user = getStorageUser();
    const legacy = parseStorageArray(legacyKey);
    if (user?.id && legacy.length > 0) {
        localStorage.setItem(currentKey, JSON.stringify(legacy));
        localStorage.removeItem(legacyKey);
        return legacy;
    }

    if (!user?.id) localStorage.removeItem(legacyKey);
    return [];
};

// State is scoped per account. Guest data is separated, so after logout badges reset.
let cart = loadScopedArray(getCurrentCartKey(), 'bookly_cart');
export const wishlist = loadScopedArray(getCurrentWishlistKey(), 'bookly_wishlist');

const getStoredProducts = () => {
    try { return JSON.parse(localStorage.getItem('bookly_products_v8')) || []; }
    catch { return []; }
};

const getLiveProduct = (id) => getStoredProducts().find(item => Number(item.id) === Number(id));

const getComboStockError = (combo) => {
    const books = Array.isArray(combo.comboBooks) ? combo.comboBooks : [];
    if (!books.length) return '';
    const shortage = books.find(book => {
        const live = getLiveProduct(book.id) || book;
        return Number(live.stock || 0) <= 0;
    });
    return shortage ? `Sách "${shortage.title}" trong combo hiện tại đang hết hàng` : '';
};

// Save to localStorage
const saveCart = () => localStorage.setItem(getCurrentCartKey(), JSON.stringify(cart));
const saveWishlist = () => localStorage.setItem(getCurrentWishlistKey(), JSON.stringify(wishlist));

export const getCartItems = () => cart;
export const saveWishlistState = () => saveWishlist();
export const reloadUserCartState = () => {
    cart = parseStorageArray(getCurrentCartKey());
    wishlist.splice(0, wishlist.length, ...parseStorageArray(getCurrentWishlistKey()));
    updateBadges();
};

// Update UI badges
export const updateBadges = () => {
    const cartBadge = document.getElementById('cart-badge');
    const wishlistBadge = document.getElementById('wishlist-badge');
    
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    
    updateMiniCart();
};

// Add to cart
export const addToCart = (product, quantity = 1) => {
    if (!product) return false;

    const finalQty = Math.max(1, parseInt(quantity, 10) || 1);

    // Thêm vào giỏ chưa phải là mua hàng, nên không cộng dồn số lượng các lần thêm trước đó.
    // Nhưng trong MỘT LẦN thêm, nếu nhập số lượng vượt tồn kho hiện tại thì phải báo lỗi ngay.
    // Ví dụ còn 100 quyển: nhập 101 -> lỗi; nhập 100 nhiều lần -> vẫn cho vào giỏ,
    // đến bước thanh toán mới kiểm tra tổng số lượng trong giỏ.
    if (product.isCombo) {
        const comboError = getComboStockError(product);
        if (comboError) {
            showToast(comboError, 'error');
            return false;
        }

        const comboBooks = Array.isArray(product.comboBooks) ? product.comboBooks : [];
        const comboShortage = comboBooks.find(book => {
            const live = getLiveProduct(book.id) || book;
            return finalQty > Number(live.stock || 0);
        });

        if (comboShortage) {
            showToast('Số lượng sách hiện không đủ vui lòng giảm số lượng', 'error');
            return false;
        }
    } else {
        const liveProduct = getLiveProduct(product.id) || product;
        const stock = Number(liveProduct.stock || 0);

        if (stock <= 0) {
            showToast(`Sách "${product.title}" hiện đã hết hàng`, 'error');
            return false;
        }

        if (finalQty > stock) {
            showToast('Số lượng sách hiện không đủ vui lòng giảm số lượng', 'error');
            return false;
        }
    }

    const baseCartKey = product.cartKey || product.id;
    const lineCartKey = `${baseCartKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cart.push({ ...product, cartKey: lineCartKey, baseCartKey, quantity: finalQty });

    saveCart();
    updateBadges();
    showToast(`Đã thêm "${product.title}" vào giỏ hàng`);
    
    // Confetti effect
    if (window.confetti) {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B4513', '#2D5016', '#eab308']
        });
    }
    return true;
};

// Toggle wishlist
export const toggleWishlist = (product) => {
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`Đã xóa "${product.title}" khỏi yêu thích`, 'info');
    } else {
        wishlist.push(product);
        showToast(`Đã thêm "${product.title}" vào yêu thích`);
    }
    saveWishlist();
    updateBadges();
    return index === -1; // returns true if added, false if removed
};

export const isInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
};

// Mini cart update
export const updateMiniCart = () => {
    const miniCart = document.getElementById('mini-cart');
    if (!miniCart) return;
    
    if (cart.length === 0) {
        miniCart.innerHTML = '<p class="text-center" style="font-size: 0.9rem; color: #666;">Giỏ hàng đang trống.</p>';
        return;
    }
    
    let html = '<div style="max-height: 250px; overflow-y: auto; margin-bottom: 10px;">';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div style="display: flex; gap: 10px; margin-bottom: 10px; border-bottom: 1px solid var(--color-border); padding-bottom: 10px;">
                <img src="${item.cover}" style="width: 50px; height: 75px; object-fit: cover; border-radius: 4px;" alt="${item.title}">
                <div>
                    <h4 style="font-size: 0.9rem; margin-bottom: 5px;">${item.title}</h4>
                    ${item.isCombo && Array.isArray(item.comboBooks) ? `<p style="font-size:0.76rem;color:#888;margin:0 0 4px;">${item.comboBooks.map(b => b.title).join(', ')}</p>` : ''}
                    <p style="font-size: 0.8rem; color: #666;">${item.quantity} x <span style="color: var(--color-primary); font-weight: 600;">${formatCurrency(item.price)}</span></p>
                    ${item.originalPrice && item.originalPrice > item.price ? `<p style="font-size:0.76rem;color:#aaa;text-decoration:line-through;margin:0;">${formatCurrency(item.originalPrice)}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div>
             <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 10px;">
                <span>Tổng:</span>
                <span style="color: var(--color-primary);">${formatCurrency(total)}</span>
             </div>
             <a href="cart.html" class="btn btn-primary" style="width: 100%; text-align: center; padding: 0.5rem;">Xem giỏ hàng</a>`;
             
    miniCart.innerHTML = html;
};

// Cart page specific functions
export const renderCartPage = () => {
    const tbody = document.getElementById('cart-tbody');
    const container = document.getElementById('cart-container');
    const emptyMsg = document.getElementById('empty-cart-message');
    
    if (!tbody || !container || !emptyMsg) return;
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    emptyMsg.style.display = 'none';
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <img src="${item.cover}" class="cart-item-img" alt="${item.title}">
                        <div>
                            <h4 style="margin-bottom: 5px;">${item.isCombo ? item.title : `<a href="product-detail.html?id=${item.id}">${item.title}</a>`}</h4>
                            <p style="font-size: 0.85rem; color: #888;">${item.author || item.saleSource || 'Bookly'}</p>
                            ${item.isCombo && Array.isArray(item.comboBooks) ? `<div class="combo-cart-books">${item.comboBooks.map(book => `<a href="product-detail.html?id=${book.id}">${book.title}</a><span>x ${item.quantity}</span>`).join('')}</div>` : ''}
                            ${item.originalPrice && item.originalPrice > item.price ? `<p style="font-size:0.78rem;color:#999;margin:0;"><span style="text-decoration:line-through;">${formatCurrency(item.originalPrice)}</span> <span style="color:var(--color-danger);font-weight:700;margin-left:6px;">-${item.discountPct || ''}%</span></p>` : ''}
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600;">${formatCurrency(item.price)}</td>
                <td>
                    <div class="qty-input">
                        <button class="qty-btn dec" data-index="${index}">-</button>
                        <input type="number" class="qty-number-input qty-direct-input" data-index="${index}" value="${item.quantity}" min="1">
                        <button class="qty-btn inc" data-index="${index}">+</button>
                    </div>
                </td>
                <td style="font-weight: 700; color: var(--color-primary);">${formatCurrency(itemTotal)}</td>
                <td>
                    <button class="btn-icon text-danger remove-item" data-index="${index}">
                        <i class="ph ph-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;

    // Cart page no longer shows order summary. Keep these guards for older markup.
    const subtotalEl = document.getElementById('subtotal');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(total);
    const hint = document.getElementById('shipping-hint');
    if (hint) hint.innerHTML = '';
    
    // Bind events
    tbody.querySelectorAll('.dec').forEach(btn => {
        btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.index, -1));
    });
    tbody.querySelectorAll('.inc').forEach(btn => {
        btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.index, 1));
    });
    tbody.querySelectorAll('.qty-direct-input').forEach(input => {
        input.addEventListener('change', (e) => setQuantity(e.target.dataset.index, e.target.value));
        input.addEventListener('blur', (e) => setQuantity(e.target.dataset.index, e.target.value));
    });
    tbody.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            removeItem(index);
        });
    });
};

const updateQuantity = (index, change) => {
    if (cart[index]) {
        setQuantity(index, cart[index].quantity + change);
    }
};

const setQuantity = (index, newQty) => {
    const item = cart[index];
    if (!item) return;

    let qty = Math.max(1, parseInt(newQty, 10) || 1);

    if (!item.isCombo) {
        const live = getLiveProduct(item.id) || item;
        const stock = Number(live.stock || 0);
        if (qty > stock) {
            showToast('Số lượng sách hiện không đủ vui lòng giảm số lượng', 'error');
            qty = Math.min(item.quantity, stock);
            if (stock <= 0) qty = 1;
        }
    }

    item.quantity = qty;
    saveCart();
    updateBadges();
    renderCartPage();
};

const removeItem = (index) => {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
        updateBadges();
        renderCartPage();
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    }
};

export const clearCart = () => {
    cart.length = 0;
    saveCart();
    updateBadges();
};
