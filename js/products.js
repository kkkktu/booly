import { products as initialProducts, comboPacks, blogPosts } from '../data/products.js';
export { comboPacks, blogPosts };
import { formatCurrency, addToCart, toggleWishlist, isInWishlist, showToast } from './cart.js';

// Clear old cache versions
['bookly_products_v1','bookly_products_v2','bookly_products_v3','bookly_products_v4','bookly_products_v5'].forEach(k => localStorage.removeItem(k));

const parseStoredProducts = () => {
    try {
        const stored = JSON.parse(localStorage.getItem('bookly_products_v8'));
        if (!Array.isArray(stored)) return null;
        return stored;
    } catch {
        return null;
    }
};

const mergeProductData = (initial, stored) => {
    return initial.map(initialItem => {
        const storedItem = stored.find(product => product.id === initialItem.id);
        if (!storedItem) return initialItem;
        return {
            ...initialItem,
            stock: storedItem.stock ?? initialItem.stock,
            sold: storedItem.sold ?? initialItem.sold,
            rating: storedItem.rating ?? initialItem.rating,
            reviews: Array.isArray(storedItem.reviews) ? storedItem.reviews : initialItem.reviews,
        };
    });
};

const storedProducts = parseStoredProducts();
export let products = storedProducts ? mergeProductData(initialProducts, storedProducts) : [...initialProducts];
localStorage.setItem('bookly_products_v8', JSON.stringify(products));

export const updateProductStock = (cartItems) => {
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
            if (product.stock < 0) product.stock = 0;
        }
    });
    localStorage.setItem('bookly_products_v8', JSON.stringify(products));
};

export const updateProductSold = (cartItems) => {
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.sold = (product.sold || 0) + item.quantity;
        }
    });
    localStorage.setItem('bookly_products_v8', JSON.stringify(products));
};


// Intersection Observer for animations and lazy loading
export const initObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: lazy load images
                const img = entry.target.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .product-card').forEach(el => observer.observe(el));
};

// Render Products list
export const renderProducts = (containerId, productsToRender) => {
    console.log('renderProducts called with:', containerId, 'products:', productsToRender.length);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }

    if (productsToRender.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-xl);">Không tìm thấy sản phẩm nào.</div>';
        return;
    }

    let html = '';
    productsToRender.forEach(product => {
        const heartClass = isInWishlist(product.id) ? 'ph-fill' : 'ph';
        const heartColor = isInWishlist(product.id) ? 'var(--color-danger)' : 'currentColor';
        const isOutOfStock = (product.stock || 0) <= 0;
        const outOfStockClass = isOutOfStock ? ' is-out-of-stock' : '';
        const soldOutBadge = isOutOfStock ? '<div class="sold-out-badge">Hết hàng</div>' : '';
        
        html += `
            <div class="product-card fade-in-up${product.featured ? ' featured-large' : ''}${outOfStockClass}" data-id="${product.id}">${product.featured ? '<div class="featured-badge"><i class="ph ph-crown" style="margin-right:3px;"></i>Nổi bật</div>' : ''}${soldOutBadge}
                <div class="product-img-wrapper">
                    <img data-src="${product.cover}" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="${product.title}" class="product-img" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\' viewBox=\'0 0 400 600\'%3E%3Crect width=\'400\' height=\'600\' fill=\'%23f5f0e8\'/%3E%3Ctext x=\'200\' y=\'280\' text-anchor=\'middle\' font-size=\'80\'%3E📚%3C/text%3E%3Ctext x=\'200\' y=\'360\' text-anchor=\'middle\' fill=\'%238B4513\' font-size=\'16\'%3EKhông có ảnh%3C/text%3E%3C/svg%3E';">
                    <div class="product-actions">
                        <button class="btn btn-primary w-100 quick-view-btn" data-id="${product.id}" style="width: 100%;">Xem nhanh</button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <a href="product-detail.html?id=${product.id}"><h3 class="product-title">${product.title}</h3></a>
                    <div class="product-author">${product.author}</div>
                    <div class="product-footer">
                        <div class="product-price">${formatCurrency(product.price)}</div>
                        <div class="product-rating">
                            <i class="ph-fill ph-star"></i>
                            <span>${product.rating}</span>
                        </div>
                    </div>
                </div>
                <!-- Absolute Wishlist and Cart Buttons for Card -->
                <button class="btn-icon wishlist-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.8); border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; z-index: 10;">
                    <i class="${heartClass} ph-heart" style="color: ${heartColor}"></i>
                </button>
                <button class="btn-icon compare-btn" data-id="${product.id}" style="position: absolute; top: 50px; right: 10px; background: rgba(255,255,255,0.8); border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; z-index: 10; opacity: 0; transition: opacity 0.3s;" title="So sánh sách">
                    <i class="ph ph-scales" style="color: var(--color-primary);"></i>
                </button>
                <button class="btn-icon add-cart-btn" data-id="${product.id}" style="position: absolute; bottom: 120px; right: 15px; background: var(--color-primary); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: var(--shadow-sm); opacity: 0; transition: opacity 0.3s; pointer-events: none;">
                    <i class="ph ph-shopping-cart" style="font-size: 1.2rem;"></i>
                </button>
            </div>
        `;
    });

    // small css tweak for add to cart on hover
    const style = document.createElement('style');
    style.innerHTML = `
        .product-card:hover .add-cart-btn, .product-card:hover .compare-btn { opacity: 1 !important; pointer-events: auto !important; }
        .product-card .add-cart-btn:hover { background: var(--color-secondary) !important; transform: scale(1.1); }
        .product-card .compare-btn:hover { background: var(--color-bg) !important; transform: scale(1.1); }
    `;
    document.head.appendChild(style);

    container.innerHTML = html;
    initObserver();

    // Bind events
    bindProductEvents(container);
};

const bindProductEvents = (container) => {
    container.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
                const added = toggleWishlist(product);
                document.querySelectorAll(`.wishlist-btn[data-id="${id}"]`).forEach(b => {
                    const icon = b.querySelector('i');
                    if (added) {
                        icon.classList.remove('ph');
                        icon.classList.add('ph-fill');
                        icon.style.color = 'var(--color-danger)';
                    } else {
                        icon.classList.remove('ph-fill');
                        icon.classList.add('ph');
                        icon.style.color = 'currentColor';
                    }
                });
            }
        });
    });

    container.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product && (product.stock || 0) > 0) addToCart(product, 1);
        });
    });

    container.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            showQuickView(id);
        });
    });

    container.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleCompare(id);
        });
    });

    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;
            const id = parseInt(card.dataset.id);
            if (id) window.location.href = `product-detail.html?id=${id}`;
        });
    });
};

const getCompareKey = () => {
    const user = JSON.parse(localStorage.getItem('bookly_currentUser'));
    return user?.id ? `bookly_compare_user_${user.id}` : 'bookly_compare';
};

export const toggleCompare = (id) => {
    let compareList = JSON.parse(localStorage.getItem(getCompareKey())) || [];
    if (compareList.includes(id)) {
        compareList = compareList.filter(item => item !== id);
    } else {
        if (compareList.length >= 4) {
            alert('Chỉ có thể so sánh tối đa 4 quyển sách');
            return;
        }
        compareList.push(id);
    }
    localStorage.setItem(getCompareKey(), JSON.stringify(compareList));
    updateCompareFAB();
};

export const updateCompareFAB = () => {
    let compareList = JSON.parse(localStorage.getItem(getCompareKey())) || [];
    let fab = document.getElementById('compare-fab-widget');
    if (!fab) {
        fab = document.createElement('button');
        fab.id = 'compare-fab-widget';
        fab.className = 'compare-fab';
        fab.innerHTML = `
            So sánh sách
        `;
        document.body.appendChild(fab);
        fab.addEventListener('click', () => {
            window.location.href = 'compare.html';
        });
    }

    if (compareList.length > 0) {
        fab.classList.add('visible');
    } else {
        fab.classList.remove('visible');
    }
};

// Initialize Compare FAB
document.addEventListener('DOMContentLoaded', () => {
    updateCompareFAB();
});

export const showQuickView = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="close-modal">&times;</button>
                <div id="quick-view-content" style="padding: var(--space-lg); display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);">
                    <!-- Content injected via JS -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind close events
        const closeModalBtn = modal.querySelector('#close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    const content = document.getElementById('quick-view-content');
    if (!content) return;

    content.innerHTML = `
        <div style="border-radius: var(--radius-sm); overflow: hidden;">
            <img src="${product.cover}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: contain; max-height: 500px; background: #eee;" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'500\' viewBox=\'0 0 400 500\'%3E%3Crect width=\'400\' height=\'500\' fill=\'%23f5f0e8\'/%3E%3Ctext x=\'200\' y=\'260\' text-anchor=\'middle\' font-size=\'80\'%3E%F0%9F%93%9A%3C/text%3E%3Ctext x=\'200\' y=\'340\' text-anchor=\'middle\' fill=\'%238B4513\' font-size=\'16\'%3EKhông có ảnh%3C/text%3E%3C/svg%3E';">
        </div>
        <div style="display: flex; flex-direction: column;">
            <div style="color: var(--color-secondary); font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem;">${product.category}</div>
            <h2 style="font-size: 2rem; margin-bottom: 0.5rem; color:#ffffff;">${product.title}</h2>
            <div style="color: #b8b8b8; margin-bottom: 1rem;">bởi <span style="font-weight: 600; color: var(--text-primary);">${product.author}</span></div>
            
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 1.5rem;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${formatCurrency(product.price)}</div>
                <div style="display: flex; align-items: center; gap: 5px; color: var(--accent);">
                    <i class="ph-fill ph-star" style="color: var(--color-star);"></i>
                    <span style="color: var(--text-primary); font-weight: 600;">${product.rating}</span>
                </div>
            </div>
            
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.8;">${product.description}</p>
            
            <div style="display: flex; gap: 15px; margin-top: auto;">
                <button class="btn btn-primary" id="qv-buy-now" style="flex: 1;">Mua ngay</button>
                <a href="product-detail.html?id=${product.id}" class="btn btn-secondary" style="flex: 1; text-align: center;">Xem chi tiết</a>
            </div>
        </div>
    `;

    document.getElementById('qv-buy-now').addEventListener('click', () => {
        addToCart(product, 1);
        window.location.href = 'checkout.html';
    });

    modal.classList.add('active');
};

const getAuthorProducts = (author, excludeId = null) => {
    return products.filter(product => product.author === author && product.id !== excludeId);
};

export const renderAuthorPage = () => {
    const params = new URLSearchParams(window.location.search);
    const rawAuthor = params.get('author');
    if (!rawAuthor) {
        window.location.href = 'index.html';
        return;
    }

    const authorName = decodeURIComponent(rawAuthor);
    const authorBooks = getAuthorProducts(authorName);
    const authorContainer = document.getElementById('author-page-container');
    if (!authorContainer) return;

    document.title = `${authorName} | Bookly`;

    const categories = [...new Set(authorBooks.map(item => item.category))];
    const intro = authorBooks.length > 0
        ? `Khám phá ${authorBooks.length} cuốn sách của tác giả ${authorName}. ${categories.length ? `Thể loại: ${categories.join(', ')}.` : ''}`
        : `Hiện chưa có sách nào của tác giả ${authorName} trong cửa hàng.`;

    authorContainer.innerHTML = `
        <section style="padding: var(--space-xl) 0;">
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-lg);">
                <div style="flex: 1 1 320px; min-width: 280px; background: linear-gradient(135deg, rgba(37, 42, 67, 0.98), rgba(72, 47, 99, 0.98)); border-radius: var(--radius-md); color: white; padding: 2rem; box-shadow: var(--shadow-md);">
                    <div style="text-transform: uppercase; letter-spacing: 0.15em; color: #b9a6ff; font-size: 0.85rem; margin-bottom: 1rem;">Thông tin tác giả</div>
                    <h1 style="font-size: 2.8rem; margin-bottom: 1rem;">${authorName}</h1>
                    <p style="line-height: 1.8; color: rgba(255,255,255,0.85);">${intro}</p>
                    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                        <div style="background: rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 1rem;">
                            <div style="font-size: 2rem; font-weight: 700;">${authorBooks.length}</div>
                            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.7);">Sách</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.08); border-radius: var(--radius-sm); padding: 1rem;">
                            <div style="font-size: 2rem; font-weight: 700;">${categories.length}</div>
                            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.7);">Danh mục</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section style="padding-bottom: var(--space-xl);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: var(--space-lg);">
                <div>
                    <div style="color: var(--color-secondary); text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.85rem; margin-bottom: 0.5rem;">Tác phẩm của tác giả</div>
                    <h2 style="font-size: 2rem; margin: 0;">${authorName}</h2>
                </div>
                <a href="index.html" class="btn btn-secondary" style="white-space: nowrap;">Quay lại trang chủ</a>
            </div>
            <div id="author-books-grid" class="products-grid"></div>
        </section>
    `;

    renderProducts('author-books-grid', authorBooks);
};

// Render Product Detail Page
export const renderProductDetail = () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    const product = products.find(p => p.id === id);
    if (!product) {
        document.getElementById('product-detail-container').innerHTML = '<h2>Không tìm thấy sản phẩm</h2>';
        return;
    }

    // Update Breadcrumb
    document.title = `${product.title} | Bookly`;
    document.getElementById('bc-category').textContent = product.category;
    document.getElementById('bc-title').textContent = product.title;

    // Render Detail
    const container = document.getElementById('product-detail-container');
    
    container.innerHTML = `
        <div class="product-gallery">
            <img src="${product.cover}" alt="${product.title}" class="product-main-img" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'600\' viewBox=\'0 0 400 600\'%3E%3Crect width=\'400\' height=\'600\' fill=\'%23f5f0e8\'/%3E%3Ctext x=\'200\' y=\'280\' text-anchor=\'middle\' font-size=\'80\'%3E%F0%9F%93%9A%3C/text%3E%3Ctext x=\'200\' y=\'360\' text-anchor=\'middle\' fill=\'%238B4513\' font-size=\'16\'%3EKhông có ảnh%3C/text%3E%3C/svg%3E';">
        </div>
        <div class="product-info-full">
            <div style="color: var(--color-secondary); font-size: 0.9rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 1px;">${product.category}</div>
            <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${product.title}</h1>
            <div style="font-size: 1.1rem; color: #666; margin-bottom: 1.5rem;">Tác giả: <a href="author.html?author=${encodeURIComponent(product.author)}" class="author-link" style="font-weight: 600; color: var(--color-text); text-decoration: underline;">${product.author}</a></div>
            
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 2rem;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">${formatCurrency(product.price)}</div>
                <div style="display: flex; align-items: center; gap: 5px; background: #fff8e1; padding: 5px 10px; border-radius: 20px;">
                    <i class="ph-fill ph-star" style="color: var(--color-star);"></i>
                    <span style="font-weight: 600;">${product.rating}</span>
                </div>
                <div style="color: ${product.stock <= 0 ? 'var(--color-danger)' : '#888'}; font-size: 0.9rem; font-weight: ${product.stock <= 0 ? '600' : '400'};">${product.stock <= 0 ? 'Hết hàng' : `(Còn ${product.stock} quyển)`}</div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem; font-size: 1.2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Mô tả sản phẩm</h3>
                <p style="color: #444; line-height: 1.8; font-size: 1.05rem;">${product.description}</p>
            </div>
            
            <div style="display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-xl);">
                <div class="qty-input" ${product.stock <= 0 ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
                    <button class="qty-btn" id="pd-dec" ${product.stock <= 0 ? 'disabled' : ''}>-</button>
                    <input type="number" class="qty-number-input" id="pd-qty" value="1" min="1" max="${Math.max(product.stock, 1)}" ${product.stock <= 0 ? 'disabled' : ''}>
                    <button class="qty-btn" id="pd-inc" ${product.stock <= 0 ? 'disabled' : ''}>+</button>
                </div>
                <button class="btn btn-primary" id="pd-add-cart" style="flex: 1; padding: 1rem; font-size: 1.1rem;" ${product.stock <= 0 ? 'disabled' : ''}>${product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}</button>
                <button class="btn-icon wishlist-btn" id="pd-wishlist" style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); width: 54px; height: 54px; display: flex; align-items: center; justify-content: center;">
                    <i class="${isInWishlist(product.id) ? 'ph-fill' : 'ph'} ph-heart" style="font-size: 1.5rem; color: ${isInWishlist(product.id) ? 'var(--color-danger)' : 'currentColor'};"></i>
                </button>
                <button id="pd-share" title="Chia sẻ sản phẩm" style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; background: transparent; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='var(--color-primary)';this.style.color='#fff';this.style.borderColor='var(--color-primary)'" onmouseout="this.style.background='transparent';this.style.color='inherit';this.style.borderColor='var(--color-border)'">
                    <i class="ph ph-share-network" style="font-size: 1.5rem;"></i>
                </button>
            </div>
        </div>
    `;

    const sameAuthorBooks = getAuthorProducts(product.author, product.id);
    if (sameAuthorBooks.length > 0) {
        container.insertAdjacentHTML('beforeend', `
            <section class="product-detail-related">
                <div class="product-detail-related-header">
                    <div>
                        <span class="section-label">Cùng tác giả</span>
                        <h2 class="section-category-title">Các sách khác của ${product.author}</h2>
                        <p class="product-detail-related-desc">Khám phá thêm những tác phẩm cùng tác giả.</p>
                    </div>
                    <a href="author.html?author=${encodeURIComponent(product.author)}" class="btn btn-secondary" style="white-space: nowrap;">Xem tất cả</a>
                </div>
                <div id="related-author-books" class="related-books-grid"></div>
            </section>
        `);
        renderProducts('related-author-books', sameAuthorBooks);
    }

    // F4: Personalization - Similar Books based on Category
    const similarBooks = products
        .filter(p => p.id !== product.id && p.category === product.category)
        .sort(() => 0.5 - Math.random()) // shuffle
        .slice(0, 4);

    if (similarBooks.length > 0) {
        container.insertAdjacentHTML('beforeend', `
            <section class="product-detail-related product-detail-related--suggestions">
                <div class="product-detail-related-header">
                    <div>
                        <span class="section-label">Gợi ý cho bạn</span>
                        <h2 class="section-category-title">Sách Cùng Thể Loại</h2>
                        <p class="product-detail-related-desc">Những cuốn sách cùng thể loại bạn có thể thích.</p>
                    </div>
                </div>
                <div id="similar-books-grid" class="related-books-grid"></div>
            </section>
        `);
        renderProducts('similar-books-grid', similarBooks);
    }

    // Render Reviews
    const reviewsContainer = document.getElementById('reviews-container');
    const renderReviews = () => {
        let reviewsHtml = '';
        if (product.reviews && product.reviews.length > 0) {
            product.reviews.forEach(review => {
                let stars = '';
                for(let i=0; i<5; i++) {
                    stars += `<i class="${i < review.rating ? 'ph-fill' : 'ph'} ph-star" style="color: var(--color-star);"></i>`;
                }
                reviewsHtml += `
                    <div style="background: var(--color-white); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
                            <div style="font-weight: 600;">${review.user}</div>
                            <div style="display: flex; gap: 2px;">${stars}</div>
                        </div>
                        <p style="color: #555;">${review.comment}</p>
                    </div>
                `;
            });
        } else {
            reviewsHtml = '<p style="color:#888;">Chưa có đánh giá nào cho sách này.</p>';
        }
        reviewsContainer.innerHTML = reviewsHtml;
    };
    renderReviews();

    // Review Form Logic (F1)
    const ratingStars = document.querySelectorAll('#rating-input i');
    const ratingInput = document.getElementById('review-rating');
    const reviewForm = document.getElementById('review-form');

    if (ratingStars.length && ratingInput && reviewForm) {
        ratingStars.forEach(star => {
            star.addEventListener('click', (e) => {
                const val = parseInt(e.target.dataset.val);
                ratingInput.value = val;
                ratingStars.forEach((s, idx) => {
                    if (idx < val) {
                        s.classList.remove('ph');
                        s.classList.add('ph-fill');
                    } else {
                        s.classList.remove('ph-fill');
                        s.classList.add('ph');
                    }
                });
            });
        });

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = parseInt(ratingInput.value);
            const comment = document.getElementById('review-comment').value.trim();
            if (rating === 0) {
                alert('Vui lòng chọn số sao đánh giá!');
                return;
            }
            if (!comment) {
                alert('Vui lòng nhập nội dung đánh giá!');
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('bookly_currentUser'));
            const newReview = {
                user: currentUser?.name || currentUser?.username || 'Khách',
                userId: currentUser?.id || null,
                rating,
                comment,
                date: new Date().toISOString()
            };

            if (!product.reviews) product.reviews = [];
            product.reviews.unshift(newReview);
            
            // Re-calculate average rating
            const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
            product.rating = (totalRating / product.reviews.length).toFixed(1);

            // Save to localStorage
            localStorage.setItem('bookly_products_v8', JSON.stringify(products));

            // Re-render reviews and update UI
            renderReviews();
            document.querySelector('.product-info-full .ph-fill.ph-star + span').textContent = product.rating;
            
            // Reset form
            reviewForm.reset();
            ratingInput.value = 0;
            ratingStars.forEach(s => {
                s.classList.remove('ph-fill');
                s.classList.add('ph');
            });
            alert('Cảm ơn bạn đã đánh giá!');
        });
    }

    // Detail Events
    let qty = product.stock > 0 ? 1 : 0;
    const qtyInput = document.getElementById('pd-qty');
    const syncQty = (val) => {
        qty = Math.max(1, val);
        if (qtyInput) qtyInput.value = qty || 1;
    };

    if (product.stock > 0) {
        document.getElementById('pd-dec').addEventListener('click', () => syncQty(qty - 1));
        document.getElementById('pd-inc').addEventListener('click', () => {
            syncQty(qty + 1);
        });
        qtyInput.addEventListener('change', () => {
            const parsed = parseInt(qtyInput.value, 10);
            syncQty(isNaN(parsed) ? 1 : parsed);
        });
        qtyInput.addEventListener('blur', () => {
            const parsed = parseInt(qtyInput.value, 10);
            syncQty(isNaN(parsed) ? 1 : parsed);
        });
    }
    document.getElementById('pd-add-cart').addEventListener('click', () => {
        if (product.stock > 0) addToCart(product, qty);
    });
    
    document.getElementById('pd-wishlist').addEventListener('click', (e) => {
        const added = toggleWishlist(product);
        document.querySelectorAll(`.wishlist-btn[data-id="${product.id}"], #pd-wishlist`).forEach(b => {
            const icon = b.querySelector('i');
            if (added) {
                icon.classList.remove('ph');
                icon.classList.add('ph-fill');
                icon.style.color = 'var(--color-danger)';
            } else {
                icon.classList.remove('ph-fill');
                icon.classList.add('ph');
                icon.style.color = 'currentColor';
            }
        });
    });

    const shareBtn = document.getElementById('pd-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: product.title,
                text: `Xem ngay ${product.title} của ${product.author} tại Bookly!`,
                url: window.location.href
            };
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log('Chia sẻ bị hủy hoặc có lỗi:', err);
                }
            } else {
                // Fallback cho trình duyệt không hỗ trợ Web Share API
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Đã copy link sản phẩm vào clipboard!');
                } catch (err) {
                    alert('Trình duyệt của bạn không hỗ trợ chia sẻ!');
                }
            }
        });
    }


};
