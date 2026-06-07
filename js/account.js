import { getCurrentUser, logoutUser } from './auth.js';
import { wishlist, addToCart, formatCurrency, showToast, saveWishlistState } from './cart.js';
import { renderProducts, products, initObserver } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();

    // Protect route
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Render User Info
    document.getElementById('acc-name').textContent = currentUser.name;
    document.getElementById('acc-email').textContent = currentUser.email;
    document.getElementById('acc-avatar').textContent = currentUser.name.charAt(0).toUpperCase();

    const getOrderHistoryKey = () => {
        return currentUser?.id ? `bookly_order_history_user_${currentUser.id}` : 'bookly_order_history_guest';
    };

    // Load real order history from localStorage
    const orders = JSON.parse(localStorage.getItem(getOrderHistoryKey())) || [];
    // Calculate Stats
    const totalBooks = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

    document.getElementById('stat-total-books').textContent = totalBooks;
    document.getElementById('stat-total-spent').textContent = formatCurrency(totalSpent);


    // Render orders helper
    const renderOrders = (containerId, limit = null) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const ordersToRender = limit ? orders.slice(0, limit) : orders;

        if (ordersToRender.length === 0) {
            container.innerHTML = '<p style="color: #666; padding: 20px 0;">Bạn chưa có đơn hàng nào. <a href="index.html" style="color: var(--color-primary); font-weight: 600;">Mua sắm ngay!</a></p>';
            return;
        }

        container.innerHTML = ordersToRender.map(order => {
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;
            const targetId = !firstItem.isCombo && !String(firstItem.id).startsWith('combo') ? firstItem.id : (firstItem.comboBooks?.[0]?.id || firstItem.comboBookIds?.[0] || '');
            const comboBooksHtml = firstItem.isCombo && Array.isArray(firstItem.comboBooks)
                ? `<div class="order-combo-books">${firstItem.comboBooks.map(book => `<a href="product-detail.html?id=${book.id}">${book.title}</a>`).join('')}</div>`
                : '';
            return `
            <div class="order-card order-card-clickable" data-product-id="${targetId}">
                <img src="${firstItem.cover}" alt="${firstItem.title}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <h4 style="font-size: 1rem; margin-bottom: 5px;">
                            ${firstItem.title}
                            ${extraCount > 0 ? `<span style="font-size:0.8rem;color:#888;"> +${extraCount} sách khác</span>` : ''}
                        </h4>
                        <span style="font-size: 0.85rem; color: #888; white-space: nowrap;">${order.date}</span>
                    </div>
                    ${comboBooksHtml}
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
                        Mã ĐH: <strong>${order.id}</strong> | Tổng: <strong style="color: var(--color-primary);">${formatCurrency(order.total)}</strong>
                    </p>
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="background: #e8f5e9; color: #2e7d32; padding: 3px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600;">✓ ${order.status}</span>
                        <span style="font-size:0.82rem;color:#aaa;">Bấm vào sách để xem chi tiết</span>
                    </div>
                </div>
            </div>
            `;
        }).join('');

        container.querySelectorAll('.order-card-clickable').forEach(card => {
            card.addEventListener('click', (event) => {
                if (event.target.closest('a')) return;
                const id = card.dataset.productId;
                if (id) window.location.href = `product-detail.html?id=${id}`;
            });
        });
    };

    renderOrders('recent-orders-container', 2);
    renderOrders('all-orders-container');

    // Wishlist Tab - Filter out products that don't exist
    const validWishlist = wishlist.filter(item => products.find(p => p.id === item.id));
    
    // If wishlist was modified, save it back
    if (validWishlist.length !== wishlist.length) {
        const itemsRemoved = wishlist.length - validWishlist.length;
        if (itemsRemoved > 0) {
            wishlist.splice(0, wishlist.length, ...validWishlist);
            saveWishlistState();
        }
    }

    if (validWishlist.length > 0) {
        renderProducts('acc-wishlist-container', validWishlist);
    } else {
        const wlContainer = document.getElementById('acc-wishlist-container');
        if (wlContainer) {
            wlContainer.innerHTML = '<p style="color:#666; grid-column:1/-1; padding: 20px 0;">Danh sách yêu thích đang trống. <a href="index.html" style="color: var(--color-primary); font-weight: 600;">Khám phá sách ngay!</a></p>';
        }
    }

    const addAllWishlistBtn = document.getElementById('add-all-wishlist-btn');
    if (addAllWishlistBtn) {
        addAllWishlistBtn.addEventListener('click', () => {
            if (wishlist.length === 0) {
                showToast('Danh sách yêu thích đang trống', 'info');
                return;
            }
            wishlist.forEach(item => addToCart(item, 1));
            showToast(`Đã thêm ${wishlist.length} sách vào giỏ hàng!`, 'success');
        });
    }

    // Tabs Logic
    const tabs = document.querySelectorAll('#account-menu a[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetId = 'tab-' + tab.dataset.tab;
            document.getElementById(targetId)?.classList.add('active');
        });
    });

    // Logout
    document.getElementById('acc-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });

    // Trigger animations
    document.querySelectorAll('.fade-in-up').forEach((el, index) => {
        setTimeout(() => el.classList.add('visible'), index * 100);
    });

    // Initialize lazy loading for product images
    initObserver();
});
